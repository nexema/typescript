import { GeneratorSettings, NexemaFile, NexemaTypeDefinition } from './models'
import { TypeReference } from './type_reference'

export interface GenerateContext {
    generatorOptions: GeneratorSettings
    resolveFor(file: NexemaFile, typeId: string): TypeReference
    getObject(typeId: string): NexemaTypeDefinition
}
