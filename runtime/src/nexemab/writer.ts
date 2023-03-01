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
        if(this._buffer.length) {
            this._chunks.push(new Uint8Array(this._buffer));
            this._size += this._buffer.length;
            this._buffer = [];
        }
        this._chunks.push(chunk);
        this._size += chunk.length;
    }

    public encodeNull(): void {
        this._buffer.push(NexemabSpec.NULL);
    }

    public encodeBool(value: boolean): void {
        this._buffer.push(value ? NexemabSpec.BoolTrue : NexemabSpec.BoolFalse);
    }

    public encodeUint8(value: number): void {
        this._buffer.push(value);
    }

    public encodeUint16(value: number): void {
        const chunk = new Uint8Array(2);
        new DataView(chunk.buffer).setUint16(0, value, false);
        this.push(chunk);
    }

    public encodeUint32(value: number): void {
        const chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setUint32(0, value, false);
        this.push(chunk);
    }

    public encodeUint64(value: bigint): void {
        const chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setBigUint64(0, value, false);
        this.push(chunk);
    }

    public encodeInt8(value: number): void {
        this._buffer.push(value);
    }

    public encodeInt16(value: number): void {
        const chunk = new Uint8Array(2);
        new DataView(chunk.buffer).setInt16(0, value, false);
        this.push(chunk);
    }

    public encodeInt32(value: number): void {
        const chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setInt32(0, value, false);
        this.push(chunk);
    }

    public encodeInt64(value: bigint): void {
        const chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setBigInt64(0, value, false);
        this.push(chunk);
    }

    public encodeUvarint(value: bigint): void {
        while(value >= NexemabSpec.UvarintMinBigInt) {
            this._buffer.push(Number(BigInt.asUintN(8, value) | NexemabSpec.UvarintMinBigInt));
            value >>= BigInt(7);
        }

        this._buffer.push(Number(value));
    }

    public encodeVarint(value: bigint): void {
        let ux = value << BigInt(1);
        if(value < 0) {
            ux = ux^ux;
        }

        this.encodeUvarint(ux);
    }

    public encodeFloat32(value: number): void {
        const chunk = new Uint8Array(4);
        new DataView(chunk.buffer).setFloat32(0, value, false);
        this.push(chunk);
    }

    public encodeFloat64(value: number): void {
        const chunk = new Uint8Array(8);
        new DataView(chunk.buffer).setFloat64(0, value, false);
        this.push(chunk);
    }

    public encodeString(value: string): void {
        const chunk = NexemabSpec.TextEncoder.encode(value);
        this.encodeVarint(BigInt(chunk.byteLength));
        this.push(chunk);
    }

    public encodeBinary(value: Uint8Array): void {
        this.encodeVarint(BigInt(value.byteLength));
        this.push(value);
    }

    public beginArray(length: number): void {
        this._buffer.push(NexemabSpec.ArrayBegin);
        this.encodeVarint(BigInt(length));
    }

    public beginMap(length: number): void {
        this._buffer.push(NexemabSpec.MapBegin);
        this.encodeVarint(BigInt(length));
    }

    public takeBytes(): Uint8Array {
        this._chunks.push(new Uint8Array(this._buffer));
        this._size += this._buffer.length;

        const buffer = new Uint8Array(this._size);
        let offset = 0;
        for(const chunk of this._chunks) {
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