export interface NexemaField {
  /**
   * The original field's name, as defined in the .nex file
   */
  name: string;

  /**
   * The field's JavaScript name
   */
  jsName: string;

  /**
   * The fields index
   */
  index: number;

  /**
   * The field's value type
   */
  value?: NexemaFieldType;
}

export interface NexemaFieldType {
  /**
   * The field's value kind
   */
  kind: FieldKind;

  /**
   * If the fields accepts null values
   */
  nullable: boolean;

  /**
   * If the type is generic, the list of arguments.
   */
  arguments?: NexemaFieldType[];

  /**
   * If the kind is struct, enum or union, its type id.
   */
  typeId?: string;
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
