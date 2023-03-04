import { NexemaField } from "./definition";
import { JsType } from "./primitives";

export interface BaseNexemaTypeState {
    fields: NexemaField[]
}

export interface NexemaStructState extends BaseNexemaTypeState {
    values: JsType[],
}

export interface NexemaUnionState extends BaseNexemaTypeState {
    currentValue: JsType | undefined,
    fieldIndex: number
}