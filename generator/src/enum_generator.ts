/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ImportAlias } from './constants'
import { GeneratorBase } from './generator_base'
import { NexemaFile, NexemaTypeDefinition, NexemaTypeFieldDefinition } from './models'
import { toCamelCase } from './utils'

export class EnumGenerator extends GeneratorBase {
    public constructor(type: NexemaTypeDefinition, file: NexemaFile) {
        super(type, file)
    }

    public generate(): string {
        return `${this._writeHeader(this._type.documentation, this._type.annotations)}
        export class ${this._type.name} extends ${ImportAlias.Nexema}.NexemaEnum<${
            this._type.name
        }> {
            ${this._writeConstructor()}

            ${this._type.fields?.map((x) => this._writeField(x)).join('\n')}

            ${this._writeValuesField()}
            
            ${this._writeMethods()}
        }`
    }

    private _writeConstructor(): string {
        return `private constructor(index: number, name: string) {
            super(index, name);
        }`
    }

    private _writeField(field: NexemaTypeFieldDefinition): string {
        return `
        ${this._writeHeader(field.documentation, field.annotations, true)}
        public static readonly ${toCamelCase(field.name)}: ${this._type.name} = new ${
            this._type.name
        }(${field.index}, '${toCamelCase(field.name)}')`
    }

    private _writeValuesField(): string {
        return `public static readonly values: ReadonlyArray<${this._type.name}> = [
            ${this._type.fields!.map((x) => `${this._type.name}.${toCamelCase(x.name)}`).join(',')}
        ]`
    }

    private _writeMethods(): string {
        const byIndex = `public static byIndex(index: number): ${this._type.name} | undefined {
            switch(index) {
                ${this._type
                    .fields!.map(
                        (x) => `case ${x.index}: return ${this._type.name}.${toCamelCase(x.name)};`
                    )
                    .join('\n')}
                default: return undefined;
            }
        }`

        const byName = `public static byName(name: string): ${this._type.name} | undefined {
            switch(name) {
                ${this._type
                    .fields!.map(
                        (x) => `case '${x.name}': return ${this._type.name}.${toCamelCase(x.name)};`
                    )
                    .join('\n')}

                default: return undefined;
            }
        }`

        return `${byIndex}
        ${byName}`
    }
}
