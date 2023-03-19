import { NexemaField } from "./definition";

export interface NexemaTypeInfo {
  fieldsByJsName: { [key: string]: number };
  fieldsByIndex: { [key: number]: NexemaField };
  kind: "enum" | "struct" | "union";
}
