import { NexemaTypeDefinition } from './models'

export interface TypeReference {
    importAlias: string
    type: NexemaTypeDefinition
    path: string
}
