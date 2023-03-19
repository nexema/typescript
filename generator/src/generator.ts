import {
    GeneratedFile,
    GeneratorSettings,
    NexemaFile,
    NexemaSnapshot,
    NexemaTypeDefinition,
    PluginResult,
} from './models'
import prettier from 'prettier'
import { TypeReference } from './type_reference'
import path from 'path'
import { toSnakeCase } from './utils'
import { BaseTypeGenerator } from './base_type_generator'
import { StructGenerator } from './struct_generator'
import { UnionGenerator } from './union_generator'
import { EnumGenerator } from './enum_generator'
import { DefaultImports, PrettierSettings } from './constants'
import { GenerateContext } from './generate_context'

export class Generator {
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
    }

    public run(): PluginResult {
        const files = new Map<string, GeneratedFile>()
        const context: GenerateContext = {
            getObject: this.getObject.bind(this),
            resolveFor: this.resolveFor.bind(this),
        }
        for (const file of this._snapshot.files) {
            try {
                const buffer: string[] = []
                for (const type of file.types) {
                    switch (type.modifier) {
                        case 'base': {
                            buffer.push(new BaseTypeGenerator(type, file, context).generate())
                            break
                        }

                        case 'struct': {
                            buffer.push(new StructGenerator(type, file, context).generate())
                            break
                        }

                        case 'union': {
                            buffer.push(new UnionGenerator(type, file, context).generate())
                            break
                        }

                        case 'enum': {
                            buffer.push(new EnumGenerator(type, file, context).generate())
                            break
                        }
                    }
                }

                let sourceCode = buffer.join('\n')
                sourceCode = `/* eslint-disable @typescript-eslint/no-non-null-assertion */
${Array.from(this._currentFileImports.values()).join('\n')}
${sourceCode}`
                this.resetImports()

                files.set(file.id, {
                    id: file.id,
                    name: `${file.fileName}.ts`,
                    contents: prettier.format(sourceCode, PrettierSettings),
                })
            } catch (err) {
                return {
                    exitCode: -1,
                    errorMessage: `File [${file.path}] Error: [${err}]`,
                    files: [],
                }
            }
        }

        return {
            exitCode: 1,
            files: Array.from(files.values()),
        }
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
        this._currentFileImports.add(DefaultImports.Nexema)
    }
}
