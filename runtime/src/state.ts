import { NexemaObj } from "./primitives";
import { NexemaTypeInfo } from "./type_info";

export interface BaseNexemaTypeState {
  readonly typeInfo: NexemaTypeInfo;
}

export interface NexemaStructState extends BaseNexemaTypeState {
  readonly values: NexemaObj[];
  readonly baseValues?: NexemaObj[];
}

export interface NexemaUnionState extends BaseNexemaTypeState {
  currentValue: NexemaObj | undefined;
  fieldIndex: number;
}
