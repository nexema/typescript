import { ImportAlias } from './constants'
import { NexemaTypeDefinition, NexemaTypeFieldDefinition } from './models'
import { toCamelCase } from './utils'

export class UnionGenerator {
    private _type: NexemaTypeDefinition

    public constructor(type: NexemaTypeDefinition) {
        this._type = type
    }

    public generate(): string {
        return `${this._writeDocs()}
        export class ${this._type.name} extends ${
            ImportAlias.Nexema
        }.NexemaEnum<${this._type.name}> {
            ${this._writeConstructor()}

            ${this._type.fields?.map((x) => this._writeField(x)).join('\n')}
        }`
    }

    private _writeDocs(): string {
        if (!this._type.documentation) {
            return ''
        }

        return `/**
        ${this._type.documentation.map((x) => `* ${x}`).join('\n')}
        */`
    }

    private _writeConstructor(): string {
        return `private constructor(index: number, name: string) {
            super(index, name);
        }`
    }

    private _writeField(field: NexemaTypeFieldDefinition): string {
        return `public static readonly ${toCamelCase(field.name)}: ${
            this._type.name
        } = new EnumA(${field.index}, '${toCamelCase(field.name)}')`
    }
}
