export interface GeneratorSettings {}

export interface PluginResult {
    exitCode: number,
    files: GeneratedFile[]
}

export interface GeneratedFile {
    id: number,
    name: string,
    contents: string
}

export interface NexemaSnapshot {
    version: number,
    hashcode: number,
    files: NexemaFile[]
}

export interface NexemaFile {
    fileName: string,
    packageName: string,
    path: string,
    id: number,
    types: NexemaTypeDefinition[]
}

export interface NexemaTypeDefinition {
    id: number,
    baseType?: number,
    name: string,
    modifier: NexemaTypeModifier,
    documentation: string[],
    fields: NexemaTypeFieldDefinition[],
    annotations: {[key: string]: any}
}

export type NexemaTypeModifier = 'base' | 'enum' | 'struct' | 'union';

export interface NexemaTypeFieldDefinition {
    index: number,
    name: string,
    annotations: {[key: string]: any},
    documentation: string[],
    type?: NexemaValueType
}

export interface NexemaValueType {
    nullable: boolean
}

export interface NexemaPrimitiveValueType extends NexemaValueType {
    kind: 'primitiveValueType',
    primitive: NexemaPrimitive,
    arguments: NexemaValueType[]
}

export type NexemaPrimitive = 'string' 
    | 'boolean' 
    | 'uint' 
    | 'int'
    | 'int8'
    | 'int16'
    | 'int32'
    | 'int64'
    | 'uint8'
    | 'uint16'
    | 'uint32'
    | 'uint64'
    | 'float32'
    | 'float64'
    | 'binary'
    | 'list'
    | 'map'
    | 'type'
    | 'timestamp'
    | 'duration';

export interface NexemaTypeValueType extends NexemaValueType {
    kind: 'customType',
    objectId: number
}