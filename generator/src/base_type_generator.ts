/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ImportAlias } from './constants'
import { GeneratorBase } from './generator_base'
import { NexemaFile, NexemaTypeDefinition } from './models'
import { writeDocumentation } from './utils'

export class BaseTypeGenerator extends GeneratorBase {
    public constructor(type: NexemaTypeDefinition, file: NexemaFile) {
        super(type, file)
    }

    public generate(): string {
        return `${this._writeDocs()}
        export abstract class ${this._type.name}<T extends ${
            ImportAlias.Nexema
        }.NexemaStruct<T>> extends ${ImportAlias.Nexema}.NexemaStruct<${
            this._type.name
        }<T>> {
            ${this._writeGettersAndSetters()}
        }`
    }

    private _writeDocs(): string {
        return writeDocumentation(this._type.documentation ?? [])
    }

    private _writeGettersAndSetters(): string {
        let output = ''

        for (const field of this._type.fields!) {
            const jsType = this.getJavascriptType(field.type!)
            output += `
            public abstract get ${this._fieldNames[field.name]}(): ${jsType};
            public abstract set ${
                this._fieldNames[field.name]
            }(value: ${jsType});
            `
        }

        return output
    }
}
