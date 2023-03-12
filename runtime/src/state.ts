import { NexemaObj } from "./primitives";
import { NexemaTypeInfo } from "./type_info";

export interface BaseNexemaTypeState {
  typeInfo: NexemaTypeInfo;
}

export interface NexemaStructState extends BaseNexemaTypeState {
  values: NexemaObj[];
}

export interface NexemaUnionState extends BaseNexemaTypeState {
  currentValue: NexemaObj | undefined;
  fieldIndex: number;
}
