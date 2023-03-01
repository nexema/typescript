import { NexemabSpec } from "./spec";

export class NexemabReader {
    private readonly _buffer: Uint8Array;
    private readonly _bufferView: DataView;
    
    private _offset: number;

    constructor(buffer: Uint8Array) {
        this._buffer = buffer;
        this._bufferView = new DataView(this._buffer, this._buffer.byteOffset, this._buffer.byteLength);
        this._offset = 0;
    }

    public isNextNull(): boolean {
        const byte = this._bufferView.getUint8(this._offset);
        if(byte === NexemabSpec.NULL) {
            this._offset++;
            return true;
        }

        return false;
    }

    public decodeBool(): boolean {
        return this._bufferView.getUint8(this._offset++) == NexemabSpec.BoolTrue;
    }

    public decodeUvarint(): bigint {
        let x = BigInt(0);
        let s = 0;

        var b = 0;
        var i = 0;
        while(true) {
            b = this._bufferView.getUint8(this._offset++);
            if(i === NexemabSpec.MaxVarintLen) {
                throw "uvarint overflow";
            }

            if(b < NexemabSpec.UvarintMin) {
                if(i === NexemabSpec.MaxVarintLen-1 && b>1) {
                    throw "uvarint overflow";
                }

                return x | BigInt(b) << BigInt(s);
            }

            x |= BigInt(b & 0x7f) << BigInt(s);
            s+=7;
            i++;
        }
    }

    public decodeVarint(): bigint {
        const ux = this.decodeUvarint();
        var x = ux >> BigInt(1);
        if((ux & BigInt(0)) != BigInt(0)) {
            x ^= x;
        }

        return x;
    }

    public decodeUint8(): number {
        return this._bufferView.getUint8(this._offset++);
    }

    public decodeUint16(): number {
        const number = this._bufferView.getUint16(this._offset, false);
        this._offset+=2;
        return number;
    }

    public decodeUint32(): number {
        const number = this._bufferView.getUint32(this._offset, false);
        this._offset+=4;
        return number;
    }

    public decodeUint64(): bigint {
        const number = this._bufferView.getBigUint64(this._offset, false);
        this._offset+=8;
        return number;
    }

    public decodeInt8(): number {
        return this._bufferView.getInt8(this._offset++);
    }

    public decodeInt16(): number {
        const number = this._bufferView.getInt16(this._offset, false);
        this._offset+=2;
        return number;
    }

    public decodeInt32(): number {
        const number = this._bufferView.getInt32(this._offset, false);
        this._offset+=4;
        return number;
    }

    public decodeInt64(): bigint {
        const number = this._bufferView.getBigInt64(this._offset, false);
        this._offset+=8;
        return number;
    }

    public decodeFloat32(): number {
        const number = this._bufferView.getFloat32(this._offset, false);
        this._offset += 4;
        return number;
    }

    public decodeFloat64(): number {
        const number = this._bufferView.getFloat64(this._offset, false);
        this._offset += 8;
        return number;
    }

    public decodeString(): string {
        const strlen = Number(this.decodeVarint());
        const buffer = this._buffer.subarray(this._offset, this._offset+strlen);
        this._offset += strlen;
        return NexemabSpec.TextDecoder.decode(buffer);
    }

    public beginDecodeArray(): number {
        const code = this._bufferView.getUint8(this._offset++);
        if(code !== NexemabSpec.ArrayBegin) {
            throw "not an array";
        }

        return Number(this.decodeVarint());
    }

    public beginDecodeMap(): number {
        const code = this._bufferView.getUint8(this._offset++);
        if(code !== NexemabSpec.MapBegin) {
            throw "not a map";
        }

        return Number(this.decodeVarint());
    }

    public decodeBinary(): Uint8Array {
        const buflen = Number(this.decodeVarint());
        const buffer = this._buffer.subarray(this._offset, this._offset+buflen);
        this._offset += buflen;
        return buffer;
    }
}