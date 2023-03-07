import { NexemaField } from "./definition";
import { JsObj, NexemaObj } from "./primitives";

export interface BaseNexemaTypeState {
    fields: NexemaField[]
}

export interface NexemaStructState extends BaseNexemaTypeState {
    values: NexemaObj[],
}

export interface NexemaUnionState extends BaseNexemaTypeState {
    currentValue: NexemaObj | undefined,
    fieldIndex: number
}