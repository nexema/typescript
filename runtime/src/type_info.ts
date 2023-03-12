import { NexemaField } from "./definition";

export interface NexemaTypeInfo {
  fieldsByJsName: { [key: string]: number };
  fieldsByIndex: NexemaField[];
}
