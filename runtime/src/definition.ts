
export interface NexemaField {
    name: string,
    jsName: string,
    index: number,
    value: NexemaFieldType,
}

export interface NexemaFieldType {
    kind: FieldKind,
    jsKind: JsKind,
    arguments?: NexemaFieldType[]
}

export type JsKind = 'primitive' | 'list' | 'map' | 'type';
export type FieldKind = 'string' | 'boolean' | 'number' | 'bigint' | 'binary' | 'list' | 'map' | 'enum' | 'struct' | 'union';