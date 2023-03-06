import { NexemaField } from "./definition";
import { JsObj } from "./primitives";

export interface BaseNexemaTypeState {
    fields: NexemaField[]
}

export interface NexemaStructState extends BaseNexemaTypeState {
    values: JsObj[],
}

export interface NexemaUnionState extends BaseNexemaTypeState {
    currentValue: JsObj | undefined,
    fieldIndex: number
}