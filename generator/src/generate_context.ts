import { NexemaFile, NexemaTypeDefinition } from './models'
import { TypeReference } from './type_reference'

export interface GenerateContext {
    resolveFor(file: NexemaFile, typeId: string): TypeReference
    getObject(typeId: string): NexemaTypeDefinition
}
