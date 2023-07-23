import { FieldUtils } from "./definition";
import {
  binaryEquals,
  listEquals,
  mapEquals,
  primitiveEquals,
} from "./equality";
import { NexemabWriter } from "./nexemab/writer";
import { JsObj, Primitive, PrimitiveList, PrimitiveMap } from "./primitives";
import {
  BaseNexemaTypeState,
  NexemaStructState,
  NexemaUnionState,
} from "./state";
import { NexemaTypeInfo } from "./type_info";

/**
 * Provides a method to deep copy a Nexema type.
 */
export abstract class NexemaClonable<T extends BaseNexemaType> {
  /**
   * Returns an exact deep copy of this instance.
   */
  public abstract clone(): T;
}

/**
 * NexemaMergeable provides methods to merge a type with other type or with binary information.
 */
export abstract class NexemaMergeable<T extends BaseNexemaType> {
  /**
   * Merges the buffer into the current type, overriding any set field.
   *
   * @param buffer The buffer to merge from.
   */
  public abstract mergeFrom(buffer: Uint8Array): void;

  /**
   * Merges [other] into the current type, overriding any set field.
   *
   * @param other The type to merge from.
   */
  public abstract mergeUsing(other: T): void;
}

/**
 * NexemaEquatable provides a method to compare two Nexema types
 */
export abstract class NexemaEquatable<T extends BaseNexemaType> {
  /**
   * Returns true if this and [other] are strict equals, otherwise, false.
   */
  public abstract equals(other: T): boolean;
}

/**
 * BaseNexemaType represents the base class for every generated Nexema type
 */
export abstract class BaseNexemaType {
  protected _baseState?: BaseNexemaTypeState;

  protected constructor(baseState?: BaseNexemaTypeState | undefined) {
    this._baseState = baseState;
  }

  /**
   * Returns the full name of the type.
   */
  public static get qualifiedName(): string {
    return "unknown";
  }

  /**
   * Encodes the current instance to a Uint8Array
   */
  public abstract encode(): Uint8Array;

  /**
   * Converts the current instance to a JavaScript object
   */
  public abstract toObject(): JsObj;

  /**
   * Converts the current instance to a JSON string in a binary representation
   */
  public abstract toJson(): string;

  /**
   * Returns the type information of the current BaseNexemaType.
   */
  public getTypeInfo(): NexemaTypeInfo {
    return this._baseState!.typeInfo;
  }

  /**
   * Returns a boolean indicating if this type is of the same type that @param of
   *
   * @param of The other type to compare
   */
  public isSameType(of: BaseNexemaType): boolean {
    return this._baseState!.typeInfo.typeId === of._baseState!.typeInfo.typeId;
  }
}

/**
 * NexemaStruct is the base class for every Nexema struct or base type.
 */
export abstract class NexemaStruct<T extends NexemaStruct<T>>
  extends BaseNexemaType
  implements NexemaEquatable<T>
{
  protected get _state(): NexemaStructState {
    return this._baseState as NexemaStructState;
  }

  protected set _state(state: NexemaStructState) {
    this._baseState = state;
  }

  protected constructor(state: NexemaStructState) {
    super(state);
  }

  public equals(other: T): boolean {
    const values = this._state.values;
    const otherValues = other._state.values;

    for (let i = 0; i < values.length; i++) {
      const field = other._state.typeInfo.fieldsByIndex[i];
      const a = values[i];
      const b = otherValues[i];

      if (FieldUtils.isPrimitive(field.value!.kind)) {
        if (!primitiveEquals(a as Primitive, b as Primitive)) {
          return false;
        }
      } else if (field.value!.kind === "list") {
        const argumentType = field.value!.arguments![0];
        if (
          !listEquals(argumentType.kind, a as PrimitiveList, b as PrimitiveList)
        ) {
          return false;
        }
      } else if (field.value!.kind === "map") {
        const valueType = field.value!.arguments![1];
        if (!mapEquals(valueType.kind, a as PrimitiveMap, b as PrimitiveMap)) {
          return false;
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        if (!(a as any).equals(b as any)) {
          return false;
        }
      }
    }

    return true;
  }
}

/**
 * NexemaUnion is the base class for every Nexema union type.
 */
export abstract class NexemaUnion<
    T extends NexemaUnion<T, TFields>,
    TFields extends string
  >
  extends BaseNexemaType
  implements NexemaMergeable<T>, NexemaEquatable<T>
{
  protected get _state(): NexemaUnionState {
    return this._baseState as NexemaUnionState;
  }

  protected set _state(state: NexemaUnionState) {
    this._baseState = state;
  }

  protected constructor(state: NexemaUnionState) {
    super(state);
  }

  public abstract mergeFrom(buffer: Uint8Array): void;

  public mergeUsing(other: T): void {
    this._state.currentValue = other._state.currentValue;
    this._state.fieldIndex = other._state.fieldIndex;
  }

  public equals(other: T): boolean {
    if (this._state.fieldIndex !== other._state.fieldIndex) {
      return false;
    }

    if (this._state.fieldIndex === -1 && other._state.fieldIndex === -1) {
      return true;
    }

    const a = this._state.currentValue;
    const b = other._state.currentValue;

    const field = this._state.typeInfo.fieldsByIndex[this._state.fieldIndex];

    switch (field.value!.kind) {
      case "string":
      case "bool":
      case "uint":
      case "uint8":
      case "uint16":
      case "uint32":
      case "uint64":
      case "int":
      case "int8":
      case "int16":
      case "int32":
      case "int64":
      case "float32":
      case "float64":
      case "duration": {
        if (!primitiveEquals(a as Primitive, b as Primitive)) {
          return false;
        }
        break;
      }

      case "binary": {
        if (!binaryEquals(a as Uint8Array, b as Uint8Array)) {
          return false;
        }

        break;
      }

      case "list": {
        const argumentType = field.value!.arguments![0];
        if (
          !listEquals(argumentType.kind, a as PrimitiveList, b as PrimitiveList)
        ) {
          return false;
        }
        break;
      }

      case "map": {
        const valueType = field.value!.arguments![1];
        if (!mapEquals(valueType.kind, a as PrimitiveMap, b as PrimitiveMap)) {
          return false;
        }
        break;
      }

      case "enum":
      case "struct":
      case "union": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        if (!(a as any).equals(b as any)) {
          return false;
        }
        break;
      }
    }

    return true;
  }

  public get whichField(): TFields | "not-set" {
    if (this._state.fieldIndex === -1) {
      return "not-set";
    }

    const currentField =
      this._state.typeInfo.fieldsByIndex[this._state.fieldIndex];
    const fieldName = currentField.jsName;
    return fieldName as TFields;
  }

  public clear(): void {
    this._state.fieldIndex = -1;
    this._state.currentValue = undefined;
  }

  public override getTypeInfo(): NexemaTypeInfo {
    return this._state.typeInfo;
  }
}

/**
 * NexemaEnum is the base class for every nexema enum type
 */
export abstract class NexemaEnum<T extends NexemaEnum<T>>
  extends BaseNexemaType
  implements NexemaEquatable<T>
{
  private _index: number;
  private _name: string;

  protected abstract get _typeInfo(): NexemaTypeInfo;

  protected constructor(index: number, name: string) {
    super();
    this._index = index;
    this._name = name;
    this._baseState = {
      typeInfo: this.getTypeInfo(),
    };
  }

  /**
   * Returns the name of this enum value.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Returns the index of this enum value.
   */
  public get index(): number {
    return this._index;
  }

  public equals(other: T): boolean {
    return this._index === other._index;
  }

  public override encode(): Uint8Array {
    const writer = new NexemabWriter();
    writer.encodeUint8(this._index);
    return writer.takeBytes();
  }

  public override toObject(): JsObj {
    return this._index;
  }

  public override toJson(): string {
    return this._index.toString();
  }

  public override getTypeInfo(): NexemaTypeInfo {
    return this._typeInfo;
  }
}
