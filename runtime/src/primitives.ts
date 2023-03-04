import { Nexemable } from "./type";

export type Hashable = string | number;
export type Primitive = Hashable | bigint | boolean | null | Uint8Array | Date;
export type PrimitiveList = NexemaObj[];
export type PrimitiveMap = Map<Hashable | bigint | boolean,  NexemaObj> | JsObj;
export type JsType = Primitive | PrimitiveList | PrimitiveMap;
export type JsObj = {[key: Hashable]: NexemaObj};
export type NexemaObj = JsType | Nexemable; 