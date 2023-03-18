/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'; 

export abstract class BaseA<
  T extends $nex.NexemaStruct<T>
> extends $nex.NexemaStruct<BaseA<T>> {
  public abstract get stringField(): string;
  public abstract set stringField(value: string);

  public abstract get varintField(): bigint | null;
  public abstract set varintField(value: bigint | null);
}

export class StructA
  extends BaseA<StructA>
  implements $nex.NexemaMergeable<StructA>, $nex.NexemaClonable<StructA>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "binaryField",
        name: "binary_field",
        value: {
          kind: "binary",
        },
      },
    },
    fieldsByJsName: {
      binaryField: 0,
    },
  };

  public constructor(data: {
    stringField: string;
    varintField?: bigint | null;
    binaryField: Uint8Array;
  }) {
    super({
      typeInfo: StructA._typeInfo,
      values: [data.binaryField],
      baseValues: [data.stringField, data.varintField ?? null],
    });
  }

  public get binaryField(): Uint8Array {
    return this._state.values[0] as Uint8Array;
  }

  public set binaryField(value: Uint8Array) {
    this._state.values[0] = value;
  }

  public override get stringField(): string {
    return this._state.baseValues![0] as string;
  }

  public override set stringField(value: string) {
    this._state.baseValues![0] = value;
  }

  public override get varintField(): bigint | null {
    return this._state.baseValues![1] as bigint | null;
  }

  public override set varintField(value: bigint | null) {
    this._state.baseValues![1] = value;
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter();
    writer.encodeString(this.stringField);
    if (this.varintField) {
      writer.encodeVarint(this.varintField);
    } else {
      writer.encodeNull();
    }
    writer.encodeBinary(this.binaryField);
    return writer.takeBytes();
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer);
    this._state.baseValues![0] = reader.decodeString();
    this._state.baseValues![1] = reader.isNextNull()
      ? null
      : reader.decodeVarint();
    this._state.values[0] = reader.decodeBinary();
  }

  public mergeUsing(other: StructA): void {
    this._state.baseValues![0] = other._state.baseValues![0] as string;
    this._state.baseValues![1] = other._state.baseValues![1] as bigint | null;
    this._state.values[0] = new Uint8Array(
      other._state.values[0] as Uint8Array
    );
  }

  public override toObject(): $nex.JsObj {
    return {
      stringField: this._state.baseValues![0] as string,
      varintField: this._state.baseValues![1] as bigint | null,
      binaryField: this._state.values[0] as Uint8Array,
    };
  }

  public clone(): StructA {
    return new StructA({
      stringField: this._state.baseValues![0] as string,
      varintField: this._state.baseValues![1] as bigint | null,
      binaryField: new Uint8Array(this._state.values[0] as Uint8Array),
    });
  }

  public toString(): string {
    return `StructA(stringField: ${this._state.baseValues![0]}, varintField: ${
      this._state.baseValues![1]
    }, binaryField: ${this._state.values[0]})`;
  }
}

