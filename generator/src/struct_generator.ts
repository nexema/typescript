/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, ImportAlias } from './constants'
import { GeneratorBase } from './generator_base'
import {
    NexemaFile,
    NexemaPrimitiveValueType,
    NexemaTypeDefinition,
    NexemaValueType,
} from './models'
import { isJsPrimitive, writeDocumentation } from './utils'

export class StructGenerator extends GeneratorBase {
    public constructor(type: NexemaTypeDefinition, file: NexemaFile) {
        super(type, file)
    }

    public generate(): string {
        return `${this._writeDocs()}
        export class ${this._type.name} extends ${
            ImportAlias.Nexema
        }.NexemaStruct<${this._type.name}> implements ${
            CommonTypes.NexemaMergeable
        }<${this._type.name}>, ${CommonTypes.NexemaClonable}<${
            this._type.name
        }> {

            ${this._writeTypeInfo()}

            ${this._writeConstructor()}

            ${this._writeGettersAndSetters()}

            ${this._writeEncodeMethod()}

            ${this._writeMergeFromMethod()}
            
            ${this._writeToObjectMethod()}

            ${this._writeCloneMethod()}

            ${this._writeToStringMethod()}
        }`
    }

    private _writeDocs(): string {
        return writeDocumentation(this._type.documentation ?? [])
    }

    private _writeConstructor(): string {
        const fullnullable = this._type.fields!.every((x) => x.type!.nullable)
        return `public constructor(${this._writeConstructorDataParameter()}) {

            super({
                typeInfo: ${this._type.name}._typeInfo,
                values: [
                    ${this._type
                        .fields!.map(
                            (x) =>
                                `data${fullnullable ? '?' : ''}.${
                                    this._fieldNames[x.name]
                                }`
                        )
                        .join(',')}
                ]
            });
        }`
    }

    private _writeConstructorDataParameter(): string {
        let result = `data${
            this._type.fields!.every((x) => x.type!.nullable) ? '?' : ''
        }: {
            ${this._type
                .fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}${
                            x.type!.nullable ? '?' : ''
                        }: ${this.getJavascriptType(x.type!)}`
                )
                .join(',')}
        }`

        const defaults = this._type.defaults
            ? Array.from(Object.entries(this._type.defaults))
            : null
        if (defaults && defaults.length > 0) {
            result += ` = {
                ${defaults
                    .map(
                        ([field, value]) =>
                            `${this._fieldNames[field]}: ${this._writeJsObj(
                                value
                            )}`
                    )
                    .join(',')}
            }`
        }

        return result
    }

    private _writeGettersAndSetters(): string {
        let output = ''

        for (const field of this._type.fields!) {
            const jsType = this.getJavascriptType(field.type!)
            output += `
            public get ${this._fieldNames[field.name]}(): ${jsType} {
                return this._state.values[${field.index}] as ${jsType}
            }

            public set ${this._fieldNames[field.name]}(value: ${jsType}) {
                this._state.values[${field.index}] = value;
            }
            `
        }

        return output
    }

    private _writeEncodeMethod(): string {
        return `public override encode(): Uint8Array {
            const writer = new ${CommonTypes.NexemabWriter}();
            ${this._type
                .fields!.map(
                    (x) =>
                        `${this._writeFieldEncoder(
                            this._fieldNames[x.name],
                            x.type!
                        )}`
                )
                .join('\n')}
            return writer.takeBytes();
        }`
    }

    private _writeMergeFromMethod(): string {
        return `public override mergeFrom(buffer: Uint8Array): void {
            const reader = new ${CommonTypes.NexemabReader}(buffer);
            ${this._type
                .fields!.map(
                    (x) =>
                        `this._state.values[${
                            x.index
                        }] = ${this._writeFieldDecoder(x.type!)}`
                )
                .join('\n')}
        }`
    }

    private _writeToObjectMethod(): string {
        return `public override toObject(): ${CommonTypes.JsObj} {
            return {
                ${this._type.fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}: ${this._writeValueToJsObj(
                            `this._state.values[${x.index}]`,
                            x.type!
                        )}`
                )}
            };
        }`
    }

    private _writeCloneMethod(): string {
        return `public override clone(): ${this._type.name} {
            return new ${this._type.name}({
                ${this._type.fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}: ${
                            isJsPrimitive(x.type!)
                                ? `this._state.values[${x.index}]`
                                : this._writeDeepCloneValue(
                                      `this._state.values[${x.index}]`,
                                      x.type!
                                  )
                        }`
                )}
            });
        }`
    }

    private _writeToStringMethod(): string {
        return `public toString(): string {
            return \`${this._type.name}(${this._type
            .fields!.map(
                (x) =>
                    `${this._fieldNames[x.name]}: \${this._state.values[${
                        x.index
                    }]}`
            )
            .join(', ')})\`
        }`
    }

    private _writeFieldToString(
        variableName: string,
        valueType: NexemaValueType
    ): string {
        if (valueType.kind === 'primitiveValueType') {
            switch ((valueType as NexemaPrimitiveValueType).primitive) {
                case 'list':
                    return `(${variableName} as ${this.getJavascriptType(
                        valueType
                    )}).join(", ")`

                default:
                    return variableName
            }
        }

        return variableName
    }
}
