import { GeneratorSettings, NexemaFile, NexemaSnapshot, NexemaTypeDefinition } from './models'
import prettier from 'prettier'
import { TypeReference } from './type_reference'
import path from 'path'
import { toSnakeCase } from './utils'

export class Generator {
    private static _singleton?: Generator

    private _snapshot: NexemaSnapshot
    private _settings: GeneratorSettings
    private _types: Map<string, TypeReference>
    private _currentFileImports: Set<string>

    public constructor(snapshot: NexemaSnapshot, settings: GeneratorSettings) {
        this._settings = settings
        this._snapshot = snapshot
        this._types = new Map()
        this._currentFileImports = new Set()

        this.resetImports()
        this.scan()

        Generator._singleton = this
    }

    public run(): void {
        prettier.format('', {})
    }

    public getObject(id: string): NexemaTypeDefinition {
        if (!this._types.has(id)) {
            throw `type ${id} not found.`
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._types.get(id)!.type
    }

    public resolveFor(file: NexemaFile, objectId: string): TypeReference {
        if (!this._types.has(objectId)) {
            throw `Object with id ${objectId} not found`
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const typeReference = this._types.get(objectId)!
        if (file.fileName !== typeReference.path) {
            this._currentFileImports.add(
                `import * as ${typeReference.importAlias} from "${this.resolveImportFor(
                    file,
                    typeReference.path
                )}"`
            )
        }

        return typeReference
    }

    private resolveImportFor(file: NexemaFile, p: string): string {
        const rel = path.relative(
            path.dirname(
                path.join(this._settings.outputPath, path.dirname(file.path), file.fileName)
            ),
            p
        )
        return rel
    }

    private scan(): void {
        for (const file of this._snapshot.files) {
            for (const type of file.types) {
                this._types.set(type.id, {
                    importAlias: `$${toSnakeCase(path.parse(file.fileName).name)}`,
                    path: path.join(
                        this._settings.outputPath,
                        path.dirname(file.path),
                        file.fileName
                    ),
                    type: type,
                })
            }
        }
    }

    private resetImports(): void {
        this._currentFileImports.clear()
    }

    public static get instance(): Generator {
        if (!this._singleton) {
            throw 'No default Generator.'
        }

        return this._singleton
    }
}
