/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, ImportAlias } from './constants'
import { GeneratorBase } from './generator_base'
import { NexemaFile, NexemaTypeDefinition } from './models'
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

            ${this._writeMergeUsingMethod()}
            
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
        const defaults = this._type.defaults ?? {}
        return `public constructor(${this._writeConstructorDataParameter()}) {

            super({
                typeInfo: ${this._type.name}._typeInfo,
                values: [
                    ${this._type
                        .fields!.map(
                            (x) =>
                                `data${fullnullable ? '?' : ''}.${`${
                                    this._fieldNames[x.name]
                                } ${
                                    x.type!.nullable
                                        ? '?? null'
                                        : defaults[x.name]
                                        ? `?? ${this._writeJsObj(
                                              defaults[x.name]
                                          )}`
                                        : ''
                                }`}`
                        )
                        .join(',')}
                ]
            });
        }`
    }

    private _writeConstructorDataParameter(): string {
        return `data${
            this._type.fields!.every((x) => x.type!.nullable) ? '?' : ''
        }: {
            ${this._type
                .fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}${
                            x.type!.nullable ||
                            (this._type.defaults ?? {})[x.name]
                                ? '?'
                                : ''
                        }: ${this.getJavascriptType(x.type!)}`
                )
                .join(',')}
        }`
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
                            `this.${this._fieldNames[x.name]}`,
                            x.type!
                        )}`
                )
                .join('\n')}
            return writer.takeBytes();
        }`
    }

    private _writeMergeFromMethod(): string {
        return `public mergeFrom(buffer: Uint8Array): void {
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

    private _writeMergeUsingMethod(): string {
        return `public mergeUsing(other: ${this._type.name}): void {
            ${this._type
                .fields!.map(
                    (x) =>
                        `this._state.values[${
                            x.index
                        }] = ${this._writeDeepCloneValue(
                            `other._state.values[${
                                x.index
                            }] as ${this.getJavascriptType(x.type!)}`,
                            x.type!
                        )}`
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
                            `this._state.values[${
                                x.index
                            }] as ${this.getJavascriptType(x.type!)}`,
                            x.type!
                        )}`
                )}
            };
        }`
    }

    private _writeCloneMethod(): string {
        return `public clone(): ${this._type.name} {
            return new ${this._type.name}({
                ${this._type.fields!.map(
                    (x) =>
                        `${this._fieldNames[x.name]}: ${
                            isJsPrimitive(x.type!)
                                ? `this._state.values[${
                                      x.index
                                  }] as ${this.getJavascriptType(x.type!)}`
                                : this._writeDeepCloneValue(
                                      `this._state.values[${
                                          x.index
                                      }] as ${this.getJavascriptType(x.type!)}`,
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
}
