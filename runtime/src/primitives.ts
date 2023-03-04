export type Hashable = string | number;
export type Primitive = Hashable | bigint | boolean | null | Uint8Array | Date;
export type PrimitiveList = JsType[];
export type PrimitiveMap = Map<Hashable | bigint | boolean,  JsType> | JsObj;
export type JsType = Primitive | PrimitiveList | PrimitiveMap;
export type JsObj = {[key: Hashable]: JsType};