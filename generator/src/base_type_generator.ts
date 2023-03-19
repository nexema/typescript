/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ImportAlias } from './constants'
import { GenerateContext } from './generate_context'
import { GeneratorBase } from './generator_base'
import { NexemaFile, NexemaTypeDefinition } from './models'

export class BaseTypeGenerator extends GeneratorBase {
    public constructor(type: NexemaTypeDefinition, file: NexemaFile, context: GenerateContext) {
        super(type, file, context)
    }

    public generate(): string {
        return `${this._writeHeader(this._type.documentation, this._type.annotations)}
        export abstract class ${this._type.name}<T extends ${
            ImportAlias.Nexema
        }.NexemaStruct<T>> extends ${ImportAlias.Nexema}.NexemaStruct<${this._type.name}<T>> {
            ${this._writeGettersAndSetters()}
        }`
    }

    private _writeGettersAndSetters(): string {
        let output = ''

        for (const field of this._type.fields!) {
            const jsType = this.getJavascriptType(field.type!)
            output += `${this._writeHeader(this._type.documentation, this._type.annotations, true)}
            public abstract get ${this._fieldNames[field.name]}(): ${jsType};
            ${this._writeHeader(this._type.documentation, this._type.annotations, true)}
            public abstract set ${this._fieldNames[field.name]}(value: ${jsType});
            `
        }

        return output
    }
}
