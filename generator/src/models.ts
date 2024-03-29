export interface GeneratorSettings {
    /**
     * The path where the files will be placed.
     */
    outputPath: string

    /**
     * The name of the Nexema project.
     */
    projectName: string

    /**
     * A flag that indicates if it will generate type's TypeInfo for reflection.
     */
    typeInfo: boolean

    /**
     * A flag that indicates if Nexema type's map will be generated as Map or as an object.
     */
    useOnlyMaps: boolean

    /**
     * A flag that indicates if it will generate .toString() methods on types.
     */
    toString: boolean

    /**
     * A flag that indicates if it will generate .toJson() methods on types.
     */
    toJson: boolean

    /**
     * A flag that indicates if it will generate .toObject() methods on types.
     */
    toObject: boolean
}

export interface PluginResult {
    exitCode: number
    error?: string
    files?: GeneratedFile[]
}

export interface GeneratedFile {
    id: string
    name: string
    contents: string
    filePath: string
}

export interface NexemaSnapshot {
    version: number
    hashcode: string
    files: NexemaFile[]
}

export interface NexemaFile {
    packageName: string
    path: string
    id: string
    types: NexemaTypeDefinition[]
}

export type JsObj = string | number | bigint | boolean | JsObj[] | { [key: string]: JsObj }

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
    | 'bool'
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
            return parseValueType(value)
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

function parseValueType(value: Record<string, unknown>): unknown {
    if (value && value.kind === 'primitiveValueType') {
        const { kind, primitive, nullable, arguments: arg } = value
        return {
            kind,
            primitive,
            nullable,
            arguments:
                arg && Array.isArray(arg)
                    ? arg.map((argValue: Record<string, unknown>) => parseValueType(argValue))
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

    // this should never happen tho
    return value
}

export function parseSnapshot(input: string): NexemaSnapshot {
    return JSON.parse(input, reviver) as NexemaSnapshot
}
