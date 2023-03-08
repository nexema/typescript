export interface GeneratorSettings {
    useOnlyMaps: boolean
}

export interface PluginResult {
    exitCode: number
    files: GeneratedFile[]
}

export interface GeneratedFile {
    id: number
    name: string
    contents: string
}

export interface NexemaSnapshot {
    version: number
    hashcode: string
    files: NexemaFile[]
}

export interface NexemaFile {
    fileName: string
    packageName: string
    path: string
    id: string
    types: NexemaTypeDefinition[]
}

export type JsObj =
    | string
    | number
    | boolean
    | JsObj[]
    | { [key: string]: JsObj }

export interface NexemaTypeDefinition {
    id: string
    baseType: string | null
    name: string
    modifier: NexemaTypeModifier
    fields?: NexemaTypeFieldDefinition[]
    documentation: string[] | null
    annotations: { [key: string]: JsObj } | null
    defaults: { [key: string]: JsObj } | null
}

export type NexemaTypeModifier = 'base' | 'enum' | 'struct' | 'union'

export interface NexemaTypeFieldDefinition {
    index: number
    name: string
    annotations: { [key: string]: JsObj } | null
    documentation: string[] | null
    type?: NexemaValueType
}

export interface NexemaValueType {
    kind: string
    nullable: boolean
}

export interface NexemaPrimitiveValueType extends NexemaValueType {
    kind: 'primitiveValueType'
    primitive: NexemaPrimitive
    arguments?: NexemaValueType[]
}

export type NexemaPrimitive =
    | 'string'
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
    | 'duration'

export interface NexemaTypeValueType extends NexemaValueType {
    kind: 'customType'
    objectId: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reviver = (key: string, value: any) => {
    switch (key) {
        case 'type':
            if (value && value.kind === 'primitiveValueType') {
                const { kind, primitive, nullable, arguments: arg } = value
                return {
                    kind,
                    primitive,
                    nullable,
                    arguments: arg
                        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          arg.map((argValue: any) => ({
                              nullable: argValue.nullable,
                          }))
                        : [],
                }
            } else if (value && value.kind === 'customType') {
                const { kind, objectId, nullable } = value
                return {
                    kind,
                    nullable,
                    objectId,
                }
            }
            return value
        case 'types':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return value.map((typeDef: any) => ({
                ...typeDef,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fields: typeDef.fields.map((fieldDef: any) => ({
                    ...fieldDef,
                    type: reviver('', fieldDef.type),
                })),
            }))
        case '':
            return value
        default:
            return value
    }
}

export function parseSnapshot(input: string): NexemaSnapshot {
    return JSON.parse(input, reviver) as NexemaSnapshot
}
