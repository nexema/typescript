import { NexemaField, NexemaFieldType } from "../definition";
import { JsObj } from "../primitives";
import { NexemaTypeInfo } from "../type_info";
import { NexemabSpec } from "./spec";

/**
 * NexemabWriter contains several methods to encode a NexemaType.
 * encodeUintX and encodeIntX does not check if the value is in bounds,
 * instead, that is checked in the type when changing the value of a field.
 */
export class NexemabWriter {
  private _chunks: Uint8Array[];
  private _buffer: Array<number>;
  private _size: number;

  constructor() {
    this._chunks = [];
    this._buffer = [];
    this._size = 0;
  }

  private push(chunk: Uint8Array): void {
    if (this._buffer.length) {
      this._chunks.push(new Uint8Array(this._buffer));
      this._size += this._buffer.length;
      this._buffer = [];
    }
    this._chunks.push(chunk);
    this._size += chunk.length;
  }

  public encodeNull(): NexemabWriter {
    this._buffer.push(NexemabSpec.NULL);
    return this;
  }

  public encodeBool(value: boolean): NexemabWriter {
    this._buffer.push(value ? NexemabSpec.BoolTrue : NexemabSpec.BoolFalse);
    return this;
  }

  public encodeUint8(value: number): NexemabWriter {
    this._buffer.push(value);
    return this;
  }

  public encodeUint16(value: number): NexemabWriter {
    const chunk = new Uint8Array(2);
    new DataView(chunk.buffer).setUint16(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeUint32(value: number): NexemabWriter {
    const chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeUint64(value: bigint): NexemabWriter {
    const chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setBigUint64(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeInt8(value: number): NexemabWriter {
    this._buffer.push(value);
    return this;
  }

  public encodeInt16(value: number): NexemabWriter {
    const chunk = new Uint8Array(2);
    new DataView(chunk.buffer).setInt16(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeInt32(value: number): NexemabWriter {
    const chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeInt64(value: bigint): NexemabWriter {
    const chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setBigInt64(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeUvarint(value: bigint): NexemabWriter {
    while (value >= NexemabSpec.UvarintMinBigInt) {
      this._buffer.push(
        Number(BigInt.asUintN(8, value) | NexemabSpec.UvarintMinBigInt)
      );
      value >>= BigInt(7);
    }

    this._buffer.push(Number(value));
    return this;
  }

  public encodeVarint(value: bigint): NexemabWriter {
    let ux = value << BigInt(1);
    if (value < 0) {
      ux = ux ^ ux;
    }

    return this.encodeUvarint(ux);
  }

  public encodeFloat32(value: number): NexemabWriter {
    const chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeFloat64(value: number): NexemabWriter {
    const chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, false);
    this.push(chunk);
    return this;
  }

  public encodeString(value: string): NexemabWriter {
    const chunk = NexemabSpec.TextEncoder.encode(value);
    this.encodeVarint(BigInt(chunk.byteLength));
    this.push(chunk);
    return this;
  }

  public encodeBinary(value: Uint8Array): NexemabWriter {
    this.encodeVarint(BigInt(value.byteLength));
    this.push(value);
    return this;
  }

  public beginArray(length: number): NexemabWriter {
    this._buffer.push(NexemabSpec.ArrayBegin);
    this.encodeVarint(BigInt(length));
    return this;
  }

  public beginMap(length: number): NexemabWriter {
    this._buffer.push(NexemabSpec.MapBegin);
    this.encodeVarint(BigInt(length));
    return this;
  }

  public encodeTimestamp(value: Date): NexemabWriter {
    const milli = value.getTime();
    const seconds = Math.floor(milli / 1000);
    const nanos = (milli % 1000) * 1000000;
    return this.encodeVarint(BigInt(seconds)).encodeVarint(BigInt(nanos));
  }

  public encodeDuration(nanoseconds: bigint): NexemabWriter {
    return this.encodeVarint(nanoseconds);
  }

  public takeBytes(): Uint8Array {
    this._chunks.push(new Uint8Array(this._buffer));
    this._size += this._buffer.length;

    const buffer = new Uint8Array(this._size);
    let offset = 0;
    for (const chunk of this._chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    // free memory
    this._chunks = [];
    this._buffer = [];
    this._size = 0;

    return buffer;
  }
}
