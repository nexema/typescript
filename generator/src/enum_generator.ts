/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonTypes, ImportAlias } from './constants'
import { GenerateContext } from './generate_context'
import { GeneratorBase } from './generator_base'
import { NexemaFile, NexemaTypeDefinition, NexemaTypeFieldDefinition } from './models'
import { toCamelCase } from './utils'

export class EnumGenerator extends GeneratorBase {
    public constructor(type: NexemaTypeDefinition, file: NexemaFile, context: GenerateContext) {
        super(type, file, context)
    }

    public generate(): string {
        return `${this._writeHeader(this._type.documentation, this._type.annotations)}
        export class ${this._type.name} extends ${ImportAlias.Nexema}.NexemaEnum<${
            this._type.name
        }> {
            ${this._writeTypeInfo()}
            ${this._writeQualifiedNameGetter()}

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
        return `public static readonly values: ReadonlyArray<${this._type.name}> = Object.freeze([
            ${this._type.fields!.map((x) => `${this._type.name}.${toCamelCase(x.name)}`).join(',')}
        ])`
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

    protected override _writeTypeInfo(): string {
        return `private static readonly _typeInfo: ${CommonTypes.NexemaTypeInfo} = {
            typeId: "${this._type.id}",
            inherits: null,
            name: "${this._type.name}",
            fullName: "${this._typeQualifiedName}",
            new: () => ${this._type.name}.${this._type.fields![0].name},
            kind: "enum",
            fieldsByIndex: ${this._writeNexemaFields(true)},
            fieldsByJsName: ${this._writeNexemaFieldsByJsName()}
        }
        
        protected get _typeInfo(): ${CommonTypes.NexemaTypeInfo} {
            return ${this._type.name}._typeInfo;
        }`
    }
}
