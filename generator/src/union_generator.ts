/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, ImportAlias } from './constants'
import { GenerateContext } from './generate_context'
import * as json_encoder from './json_encoder'
import { GeneratorBase } from './generator_base'
import {
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeDefinition,
    NexemaTypeFieldDefinition,
} from './models'
import { getJavascriptType } from './utils'

export class UnionGenerator extends GeneratorBase {
    private readonly primitiveFields: NexemaTypeFieldDefinition[]
    private readonly nonPrimitiveFields: NexemaTypeFieldDefinition[]

    public constructor(type: NexemaTypeDefinition, file: NexemaFile, context: GenerateContext) {
        super(type, file, context)

        this.primitiveFields = this._type.fields!.filter((x) => {
            if (x.type!.kind === 'primitiveValueType') {
                const primitive = (x.type! as NexemaPrimitiveValueType).primitive
                return (
                    primitive !== 'list' &&
                    primitive !== 'map' &&
                    primitive !== 'binary' &&
                    primitive !== 'timestamp'
                )
            }

            return false
        })

        this.nonPrimitiveFields = this._type.fields!.filter(
            (x) => !this.primitiveFields.includes(x)
        )
    }

    public generate(): string {
        return `${this._writeHeader(this._type.documentation, this._type.annotations)}
        export class ${this._type.name} extends ${ImportAlias.Nexema}.NexemaUnion<${
            this._type.name
        }, ${this._type
            .fields!.map((x) => `'${this._fieldNames[x.name]}'`)
            .join('|')}> implements ${CommonTypes.NexemaMergeable}<${this._type.name}>, ${
            CommonTypes.NexemaClonable
        }<${this._type.name}> {

            ${this._writeTypeInfo()}

            ${this._writeConstructor()}

            ${this._writeDecodeStaticMethod()}

            ${this._writeCreateEmptyStaticMethod()}

            ${this._writeGettersAndSetters()}

            ${this._writeEncodeMethod()}

            ${json_encoder.forUnion(this._context, this._file, this._type.fields!)}

            ${this._writeMergeFromMethod()}

            ${this._writeMergeUsingMethod()}
            
            ${this._writeToObjectMethod()}

            ${this._writeCloneMethod()}

            ${this._writeToStringMethod()}
        }
        
        ${this._writeFieldTypes()}`
    }

    private _writeConstructor(): string {
        return `public constructor(data?: ${this._type.name}Builder) {
            let currentValue: any;
            let fieldIndex = -1;
            if(data) {
                ${this._writeConstructorDataSet()}
            }

            super({
                typeInfo: ${this._type.name}._typeInfo,
                currentValue,
                fieldIndex
            });
        }`
    }

    private _writeFieldTypes(): string {
        let types = ``

        for (const field of this._type.fields!) {
            types += `type ${this._type.name}_${this._fieldNames[field.name]} = {
                ${this._fieldNames[field.name]}: ${getJavascriptType(
                this._context,
                this._file,
                field.type!
            )},
            ${this._type
                .fields!.filter((x) => x.index !== field.index)
                .map((x) => `${this._fieldNames[x.name]}?: never`)}
            }
            `
        }

        types += `type ${this._type.name}Builder = ${this._type
            .fields!.map((x) => `${this._type.name}_${this._fieldNames[x.name]}`)
            .join('|')}`

        return types
    }

    private _writeConstructorDataSet(): string {
        let output = ''

        let first = true
        for (const field of this._type.fields!) {
            output += `${first ? '' : 'else '} if(data.${this._fieldNames[field.name]}) {
                currentValue = data.${this._fieldNames[field.name]}
                fieldIndex = ${field.index}
            }`

            first = false
        }

        return output
    }

    private _writeGettersAndSetters(): string {
        let output = ''

        for (const field of this._type.fields!) {
            const jsType = getJavascriptType(this._context, this._file, field.type!)
            output += `${this._writeHeader(field.documentation, field.annotations, true)}
            public get ${this._fieldNames[field.name]}(): ${jsType} {
                return this._state.currentValue as ${jsType}
            }
            ${this._writeHeader(field.documentation, field.annotations, true)}
            public set ${this._fieldNames[field.name]}(value: ${jsType}) {
                this._state.currentValue = value;
                this._state.fieldIndex = ${field.index};
            }
            `
        }

        return output
    }

    private _writeEncodeMethod(): string {
        return `public override encode(): Uint8Array {
            const writer = new ${CommonTypes.NexemabWriter}();
            switch(this._state.fieldIndex) {
                case -1: {
                        writer.encodeNull();
                        break;
                    }
                ${this._type
                    .fields!.map(
                        (x) => `case ${x.index}: {
                        writer.encodeVarint(${x.index}n)
                        ${this._writeFieldEncoder(`this._state.currentValue`, x.type!)};
                        break;
                    }`
                    )
                    .join('\n')}
            }
            return writer.takeBytes();
        }`
    }

    private _writeMergeFromMethod(): string {
        return `public mergeFrom(buffer: Uint8Array): void {
            const reader = new ${CommonTypes.NexemabReader}(buffer);
            if(reader.isNextNull()) {
                this.clear();
            } else {
                const field = reader.decodeVarint();
                switch(field) {
                    ${this._type
                        .fields!.map(
                            (x) => `case ${x.index}n: {
                        this._state.currentValue = ${this._writeFieldDecoder(x.type!)}
                        this._state.fieldIndex = ${x.index};
                        break;
                    }`
                        )
                        .join('\n')}
                }
            }
        }`
    }

    private _writeMergeUsingMethod(): string {
        return `public mergeUsing(other: ${this._type!.name}): void {
            this._state.fieldIndex = other._state.fieldIndex;
            switch(other._state.fieldIndex) {
                case -1:
                    this._state.currentValue = undefined;
                    break;

                    ${this.primitiveFields.map((x) => `case ${x.index}:`).join('\n')}
                    ${
                        this.primitiveFields.length > 0
                            ? '\nthis._state.currentValue = other._state.currentValue; break;'
                            : ''
                    }

                    ${this.nonPrimitiveFields
                        .map(
                            (x) => `case ${x.index}: 
                                this._state.currentValue = ${this._writeDeepCloneValue(
                                    `other._state.currentValue`,
                                    x.type!
                                )}
                                break;
                    `
                        )
                        .join('\n')}
            }
        }`
    }

    private _writeToObjectMethod(): string {
        return `public override toObject(): ${CommonTypes.JsObj} {
            switch(this._state.fieldIndex) {
                ${this._type
                    .fields!.map(
                        (x) => `case ${x.index}: 
                    return ${this._writeValueToJsObj(`this._state.currentValue`, x.type!, true)}
                `
                    )
                    .join('\n')}

                default:
                    return null;
            } 
        }`
    }

    private _writeCloneMethod(): string {
        return `public clone(): ${this._type.name} {
            const instance = new ${this._type.name}();
            instance._state.fieldIndex = this._state.fieldIndex;
            if(this._state.fieldIndex !== -1) {
                switch(this._state.fieldIndex) {
                    ${this.primitiveFields.map((x) => `case ${x.index}:`).join('\n')}
                    ${
                        this.primitiveFields.length > 0
                            ? 'instance._state.currentValue = this._state.currentValue; break;'
                            : ''
                    }

                    ${this.nonPrimitiveFields
                        .map(
                            (x) => `case ${x.index}: 
                                instance._state.currentValue = ${this._writeDeepCloneValue(
                                    `this._state.currentValue`,
                                    x.type!
                                )}
                                break;
                    `
                        )
                        .join('\n')}
                }
            }
            return instance;
        }`
    }

    private _writeToStringMethod(): string {
        return `public toString(): string {
            return \`${this._type.name}(\${this.whichField}: \${this._state.currentValue})\`
        }`
    }

    private _writeDecodeStaticMethod(): string {
        return `public static decode(buffer: Uint8Array): ${this._type.name} {
            const instance = Object.create(${this._type.name}.prototype) as ${this._type.name}
            instance._state = {
                typeInfo: ${this._type.name}._typeInfo,
                currentValue: undefined,
                fieldIndex: -1,
            };

            instance.mergeFrom(buffer);
            return instance;
        }`
    }

    private _writeCreateEmptyStaticMethod(): string {
        return `public static createEmpty(): ${this._type.name} {
            return new ${this._type.name}();
        }`
    }
}
