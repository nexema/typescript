export interface NexemaField {
  name: string;
  jsName: string;
  index: number;
  value: NexemaFieldType;
}

export interface NexemaFieldType {
  kind: FieldKind;
  arguments?: NexemaFieldType[];
}

export type FieldKind =
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
  | "struct"
  | "union"
  | "enum"
  | "timestamp"
  | "duration";

export const FieldUtils = {
  isPrimitive(kind: FieldKind): boolean {
    switch (kind) {
      case "list":
      case "map":
      case "struct":
      case "union":
      case "enum":
      case "binary":
        return false;

      default:
        return true;
    }
  },
};
