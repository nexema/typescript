/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, ImportAlias } from './constants'
import { GenerateContext } from './generate_context'
import { GeneratorBase } from './generator_base'
import * as json_encoder from './json_encoder'
import { NexemaFile, NexemaTypeDefinition, NexemaTypeFieldDefinition } from './models'
import {
    getDeclarationForTypeReference,
    getJavascriptType,
    isJsPrimitive,
    toCamelCase,
} from './utils'

export class StructGenerator extends GeneratorBase {
    private _baseType?: NexemaTypeDefinition

    public constructor(type: NexemaTypeDefinition, file: NexemaFile, context: GenerateContext) {
        super(type, file, context)
        if (type.baseType) {
            this._baseType = this.resolveReference(type.baseType).type
            this._fieldNames = {
                ...this._fieldNames,
                ...Object.fromEntries(
                    this._baseType!.fields!.map((x) => [x.name, toCamelCase(x.name)])
                ),
            }
        }
    }

    private get allFields(): NexemaTypeFieldDefinition[] {
        const fields: NexemaTypeFieldDefinition[] = []
        if (this._baseType && this._baseType.fields) {
            fields.push(...this._baseType.fields)
        }

        fields.push(...this._type.fields!)

        return fields
    }

    public generate(): string {
        return `${this._writeHeader(this._type.documentation, this._type.annotations)}
        export class ${this._type.name} extends ${this._writeExtends()} implements ${
            CommonTypes.NexemaMergeable
        }<${this._type.name}>, ${CommonTypes.NexemaClonable}<${this._type.name}> {

            ${this._writeTypeInfo()}
            ${this._writeQualifiedNameGetter()}

            ${this._writeConstructor()}
            
            ${this._writeCreateEmptyStaticMethod()}

            ${this._writeDecodeStaticMethod()}

            ${this._writeGettersAndSetters()}

            ${this._writeEncodeMethod()}

            ${json_encoder.forStruct(this.allFields)}

            ${this._writeMergeFromMethod()}

            ${this._writeMergeUsingMethod()}
            
            ${this._writeToObjectMethod()}

            ${this._writeCloneMethod()}

            ${this._writeToStringMethod()}
        }`
    }

    private _writeExtends(): string {
        if (this._type.baseType) {
            const ref = this.resolveReference(this._type.baseType)
            return `${getDeclarationForTypeReference(this._file, ref)}<${this._type.name}>`
        } else {
            return `${ImportAlias.Nexema}.NexemaStruct<${this._type.name}>`
        }
    }

    private _writeConstructor(): string {
        const fullnullable = this._type.fields!.every((x) => x.type!.nullable)
        const defaults = this._type.defaults ?? {}
        const baseDefaults = this._baseType?.defaults ?? {}
        return `public constructor(${this._writeConstructorDataParameter()}) {

            super({
                typeInfo: ${this._type.name}._typeInfo,
                values: [
                    ${this._type
                        .fields!.map(
                            (x) =>
                                `data${fullnullable ? '?' : ''}.${`${this._fieldNames[x.name]} ${
                                    x.type!.nullable
                                        ? '?? null'
                                        : defaults[x.name]
                                        ? `?? ${this._writeJsObj(defaults[x.name])}`
                                        : ''
                                }`}`
                        )
                        .join(',')}
                ],
                baseValues: ${
                    this._baseType
                        ? `[
                    ${this._baseType!.fields!.map(
                        (x) =>
                            `data${fullnullable ? '?' : ''}.${`${this._fieldNames[x.name]} ${
                                x.type!.nullable
                                    ? '?? null'
                                    : baseDefaults[x.name]
                                    ? `?? ${this._writeJsObj(baseDefaults[x.name])}`
                                    : ''
                            }`}`
                    ).join(',')}
                ]`
                        : 'undefined'
                }
            });
        }`
    }

    private _writeConstructorDataParameter(): string {
        return `data${
            this._type.fields!.every((x) => x.type!.nullable) &&
            (this._baseType ? this._baseType!.fields!.every((x) => x.type!.nullable) : false)
                ? '?'
                : ''
        }: {
            ${
                this._baseType
                    ? this._baseType!.fields!.map(
                          (x) =>
                              `${this._fieldNames[x.name]}${
                                  x.type!.nullable || (this._baseType!.defaults ?? {})[x.name]
                                      ? '?'
                                      : ''
                              }: ${getJavascriptType(this._context, this._file, x.type!)}`
                      ).join(',')
                    : ''
            }
            ${this._type
                .fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}${
                            x.type!.nullable || (this._type.defaults ?? {})[x.name] ? '?' : ''
                        }: ${getJavascriptType(this._context, this._file, x.type!)}`
                )
                .join(',')}
        }`
    }

    private _writeGettersAndSetters(): string {
        let output = ''

        for (const field of this._type.fields!) {
            const jsType = getJavascriptType(this._context, this._file, field.type!)
            output += `${this._writeHeader(field.documentation, field.annotations, true)}
            public get ${this._fieldNames[field.name]}(): ${jsType} {
                return this._state.values[${field.index}] as ${jsType}
            }
            ${this._writeHeader(field.documentation, field.annotations, true)}
            public set ${this._fieldNames[field.name]}(value: ${jsType}) {
                this._state.values[${field.index}] = value;
            }
            `
        }

        if (this._baseType) {
            for (const field of this._baseType!.fields!) {
                const jsType = getJavascriptType(this._context, this._file, field.type!)
                output += `
                public override get ${this._fieldNames[field.name]}(): ${jsType} {
                    return this._state.baseValues![${field.index}] as ${jsType}
                }
    
                public override set ${this._fieldNames[field.name]}(value: ${jsType}) {
                    this._state.baseValues![${field.index}] = value;
                }
                `
            }
        }

        return output
    }

    private _writeEncodeMethod(): string {
        let result = `public override encode(): Uint8Array {
            const writer = new ${CommonTypes.NexemabWriter}();
           `

        if (this._baseType) {
            result += `${this._baseType!.fields!.map(
                (x) => `${this._writeFieldEncoder(`this._state.baseValues![${x.index}]`, x.type!)}`
            ).join('\n')}`
        }
        result += `
        ${this._type
            .fields!.map(
                (x) => `${this._writeFieldEncoder(`this._state.values[${x.index}]`, x.type!)}`
            )
            .join('\n')}
        return writer.takeBytes();}`
        return result
    }

    private _writeMergeFromMethod(): string {
        let result = `public mergeFrom(buffer: Uint8Array): void {
            const reader = new ${CommonTypes.NexemabReader}(buffer);`

        if (this._baseType) {
            result += `
            ${this._baseType!.fields!.map(
                (x) => `this._state.baseValues![${x.index}] = ${this._writeFieldDecoder(x.type!)}`
            ).join('\n')}`
        }

        result += `
        ${this._type
            .fields!.map(
                (x) => `this._state.values[${x.index}] = ${this._writeFieldDecoder(x.type!)}`
            )
            .join('\n')}}`

        return result
    }

    private _writeMergeUsingMethod(): string {
        return `public mergeUsing(other: ${this._type.name}): void {
            ${
                this._baseType
                    ? this._baseType!.fields!.map(
                          (x) =>
                              `this._state.baseValues![${x.index}] = ${this._writeDeepCloneValue(
                                  `other._state.baseValues![${x.index}]`,
                                  x.type!
                              )}`
                      ).join('\n')
                    : ''
            }
            ${this._type
                .fields!.map(
                    (x) =>
                        `this._state.values[${x.index}] = ${this._writeDeepCloneValue(
                            `other._state.values[${x.index}]`,
                            x.type!
                        )}`
                )
                .join('\n')}
        }`
    }

    private _writeToObjectMethod(): string {
        return `public override toObject(): ${CommonTypes.JsObj} {
            return {
                ${
                    this._baseType
                        ? `${this._baseType
                              .fields!.map(
                                  (x) =>
                                      `${this._fieldNames[x.name]}: ${this._writeValueToJsObj(
                                          `this._state.baseValues![${x.index}]`,
                                          x.type!,
                                          true
                                      )}`
                              )
                              .join(', ')},`
                        : ''
                }
                ${this._type
                    .fields!.map(
                        (x) =>
                            `${this._fieldNames[x.name]}: ${this._writeValueToJsObj(
                                `this._state.values[${x.index}]`,
                                x.type!,
                                true
                            )}`
                    )
                    .join(',')}
            };
        }`
    }

    private _writeCloneMethod(): string {
        return `public clone(): ${this._type.name} {
            return new ${this._type.name}({
                ${
                    this._baseType
                        ? `${this._baseType!.fields!.map(
                              (x) =>
                                  `${this._fieldNames[x.name]}: ${
                                      isJsPrimitive(x.type!)
                                          ? `this._state.baseValues![${
                                                x.index
                                            }] as ${getJavascriptType(
                                                this._context,
                                                this._file,
                                                x.type!
                                            )}`
                                          : this._writeDeepCloneValue(
                                                `this._state.baseValues![${x.index}]`,
                                                x.type!,
                                                true
                                            )
                                  }`
                          )},`
                        : ''
                }
                ${this._type.fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}: ${
                            isJsPrimitive(x.type!)
                                ? `this._state.values[${x.index}] as ${getJavascriptType(
                                      this._context,
                                      this._file,
                                      x.type!
                                  )}`
                                : this._writeDeepCloneValue(
                                      `this._state.values[${x.index}]`,
                                      x.type!,
                                      true
                                  )
                        }`
                )}
            });
        }`
    }

    private _writeToStringMethod(): string {
        let result = `public toString(): string {
            return \`${this._type.name}(`

        const fields: string[] = []
        if (this._baseType) {
            for (const field of this._baseType!.fields!) {
                fields.push(
                    `${this._fieldNames[field.name]}: \${this._state.baseValues![${field.index}]}`
                )
            }
        }

        for (const field of this._type.fields!) {
            fields.push(`${this._fieldNames[field.name]}: \${this._state.values[${field.index}]}`)
        }

        result += `${fields.join(', ')})\`}`
        return result
    }

    private _writeDecodeStaticMethod(): string {
        return `public static decode(buffer: Uint8Array): ${this._type.name} {
            const instance = Object.create(${this._type.name}.prototype) as ${this._type.name}
            instance._state = {
                values: [${this._type.fields!.map(() => 'null').join(', ')}],
                baseValues: ${
                    this._baseType
                        ? `[${this._baseType!.fields!.map(() => 'null').join(', ')}]`
                        : 'undefined'
                },
                typeInfo: ${this._type.name}._typeInfo,
            }

            instance.mergeFrom(buffer);
            return instance;
        }`
    }

    private _writeCreateEmptyStaticMethod(): string {
        const writeField = (field: NexemaTypeFieldDefinition): string | undefined => {
            const defaults = {
                ...(this._type.defaults ?? {}),
                ...(this._baseType?.defaults ?? {}),
            }
            let result = `${this._fieldNames[field.name]}:`

            if (defaults[field.name]) {
                return undefined
            }

            if (field.type!.nullable) {
                result += 'null'
            } else {
                result += this.getJavascriptDefaultValueFor(field.type!)
            }

            return result
        }

        return `public static createEmpty(): ${this._type.name} {
            return new ${this._type.name}({
                ${
                    this._baseType
                        ? `${this._baseType!.fields!.map((x) => writeField(x))
                              .filter((x) => x)
                              .join(',')},`
                        : ''
                }
                ${this._type!.fields!.map((x) => writeField(x))
                    .filter((x) => x)
                    .join(', ')}
            });
        }`
    }
}
