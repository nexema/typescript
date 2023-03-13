export interface NexemaField {
  name: string;
  jsName: string;
  index: number;
  value: NexemaFieldType;
}

export interface NexemaFieldType {
  kind: FieldKind;
  jsKind: JsKind;
  nexemaType: NexemaPrimitive;
  arguments?: NexemaFieldType[];
}

export type JsKind = "primitive" | "list" | "map" | "type";
export type FieldKind =
  | "string"
  | "boolean"
  | "number"
  | "bigint"
  | "binary"
  | "list"
  | "map"
  | "enum"
  | "struct"
  | "union";

export type NexemaPrimitive =
  | "string"
  | "boolean"
  | "uint"
  | "int"
  | "int8"
  | "int16"
  | "int32"
  | "int64"
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "float32"
  | "float64"
  | "binary"
  | "list"
  | "map"
  | "type"
  | "timestamp"
  | "duration";
