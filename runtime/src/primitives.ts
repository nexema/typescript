import { Nexemable } from "./type";

export type Hashable = string | number;
export type Primitive = Hashable | bigint | boolean | null | Uint8Array | Date;
export type PrimitiveList = NexemaObj[];
export type PrimitiveMapObj = { [key: Hashable]: NexemaObj };
export type PrimitiveMap =
  | Map<Hashable | bigint | boolean, NexemaObj>
  | PrimitiveMapObj;
export type NexemaObj = Primitive | PrimitiveList | PrimitiveMap | Nexemable;
export type JsObj =
  | string
  | number
  | bigint
  | boolean
  | null
  | Uint8Array
  | Date
  | JsObj[]
  | { [key: string | number]: JsObj }
  | null;
