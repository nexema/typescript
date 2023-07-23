import path from 'path'
import { GeneratorSettings, NexemaFile } from './models'

export function generateTypeRegistry(
    files: NexemaFile[],
    generatorOptions: GeneratorSettings
): string {
    const builtTypes: string[] = []
    const imports: Record<string, string> = {}

    for (const file of files) {
        const importAlias = `$${file.id}`

        let typeCount = 0
        for (const type of file.types) {
            if (type.modifier === 'base' || type.modifier === 'enum') {
                continue
            }

            const qualifiedName = path.join(
                generatorOptions.projectName,
                path.dirname(file.path),
                type.name
            )
            builtTypes.push(`"${qualifiedName}": () => ${importAlias}.${type.name}.createEmpty()`)
            typeCount++
        }

        if (typeCount > 0) {
            imports[importAlias] = `./${file.path}`
        }
    }

    return `import type { BaseNexemaType as $BaseNexemaType } from 'nexema';
    ${Object.entries(imports)
        .map(([alias, importPath]) => `import * as ${alias} from "${importPath}";`)
        .join('\n')}
    export const TypeRegistry: Record<string, () => $BaseNexemaType> = {
        ${builtTypes.join(',\n')}
    } as const`
}
