import { Limits, NexemajSpec } from "./spec";

const BUFFER = -1 as const;
const UNWRITTEN = -2 as const;

export class NexemajWriter {
  private static readonly _textDecoder = new TextDecoder();

  private _chunks: Uint8Array[];
  private _buffer: Array<number>;
  private _size: number;
  private _lastWrittenByte: number;
  private _lastWrittenChunk: number;

  constructor() {
    this._chunks = [];
    this._buffer = [];
    this._size = 0;
    this._lastWrittenByte = UNWRITTEN;
    this._lastWrittenChunk = UNWRITTEN;
  }

  private _push(chunk: Uint8Array): void {
    if (this._buffer.length) {
      this._chunks.push(new Uint8Array(this._buffer));
      this._size += this._buffer.length;
      this._buffer = [];
    }
    this._chunks.push(chunk);
    this._lastWrittenByte = chunk[chunk.byteLength - 1];
    this._lastWrittenChunk = this._chunks.length - 1;
    this._size += chunk.byteLength;
  }

  private _writeChar(char: number): void {
    this._buffer.push(char);
    this._lastWrittenChunk = BUFFER;
    this._lastWrittenByte = char;
  }

  private _writeString(input: string): void {
    const buffer = new Uint8Array(input.length * 4 + 2);
    const view = new DataView(buffer.buffer);
    view.setUint8(0, NexemajSpec.Quotes);
    let offset = 1;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      switch (char) {
        case NexemajSpec.Quotes: {
          view.setUint8(offset++, NexemajSpec.Backlash);
          view.setUint8(offset++, NexemajSpec.Quotes);
          break;
        }

        case NexemajSpec.Backlash: {
          view.setUint8(offset++, NexemajSpec.Backlash);
          view.setUint8(offset++, NexemajSpec.Backlash);
          break;
        }

        case NexemajSpec.Newline: {
          view.setUint8(offset++, NexemajSpec.Backlash);
          view.setUint8(offset++, NexemajSpec.LetterN);
          break;
        }

        case NexemajSpec.Carriage: {
          view.setUint8(offset++, NexemajSpec.Backlash);
          view.setUint8(offset++, NexemajSpec.LetterN);
          break;
        }

        default: {
          if (char < Limits.OneByte) {
            view.setUint8(offset++, char);
          } else if (char < Limits.TwoBytes) {
            view.setUint8(offset++, 0xc0 | (char >> 6));
            view.setUint8(offset++, 0x80 | (char & 0x3f));
          } else if (
            char < Limits.ThreeBytesLower ||
            char >= Limits.ThreeBytesUpper
          ) {
            view.setUint8(offset++, 0xe0 | (char >> 12));
            view.setUint8(offset++, 0x80 | ((char >> 6) & 0x3f));
            view.setUint8(offset++, 0x80 | (char & 0x3f));
          } else {
            i++;
            const nextChar = input.charCodeAt(i);
            const rune =
              ((char & 0x3ff) << 10) | ((nextChar & 0x3ff) + 0x10000);
            view.setUint8(offset++, 0xf0 | (rune >> 18));
            view.setUint8(offset++, 0x80 | ((rune >> 12) & 0x3f));
            view.setUint8(offset++, 0x80 | ((rune >> 6) & 0x3f));
            view.setUint8(offset++, 0x80 | (rune & 0x3f));
          }
        }
      }
    }

    view.setUint8(offset++, NexemajSpec.Quotes);
    this._push(buffer.subarray(0, offset));
  }

  public writeBool(value: boolean): void {
    if (value) {
      this._push(NexemajSpec.BooleanTrue);
    } else {
      this._push(NexemajSpec.BooleanFalse);
    }
    this._writeChar(NexemajSpec.Comma);
  }

  public writeNumber(value: number | bigint): void {
    const input = value.toString();
    const buffer = new Uint8Array(input.length + 1);
    const view = new DataView(buffer.buffer);
    for (let i = 0; i < input.length; i++) {
      view.setUint8(i, input.charCodeAt(i));
    }

    view.setUint8(input.length, NexemajSpec.Comma);
    this._push(buffer);
  }

  public writeNull(): void {
    this._push(NexemajSpec.Null);
    this._writeChar(NexemajSpec.Comma);
  }

  public writeToken(char: number): void {
    this._writeChar(char);
  }

  public writeObjectEnd(): void {
    if (this._lastWrittenByte === NexemajSpec.Comma) {
      if (this._lastWrittenChunk === BUFFER) {
        this._buffer[this._buffer.length - 1] = NexemajSpec.ObjectEnd;
        this._writeChar(NexemajSpec.Comma);
        // this._lastWrittenByte = NexemajSpec.ObjectEnd;
      } else {
        const chunk = this._chunks[this._lastWrittenChunk];
        chunk[chunk.byteLength - 1] = NexemajSpec.ObjectEnd;
        this._writeChar(NexemajSpec.Comma);
        // this._lastWrittenByte = NexemajSpec.ObjectEnd;
      }
    } else {
      this._buffer.push(NexemajSpec.ObjectEnd);
      this._buffer.push(NexemajSpec.Comma);
      this._lastWrittenByte = NexemajSpec.Comma;
      this._lastWrittenChunk = BUFFER;
    }
  }

  public writeArrayEnd(): void {
    if (this._lastWrittenByte === NexemajSpec.Comma) {
      if (this._lastWrittenChunk === BUFFER) {
        this._buffer[this._buffer.length - 1] = NexemajSpec.ArrayEnd;
        this._writeChar(NexemajSpec.Comma);
        // this._lastWrittenByte = NexemajSpec.ArrayEnd;
      } else {
        const chunk = this._chunks[this._lastWrittenChunk];
        chunk[chunk.byteLength - 1] = NexemajSpec.ArrayEnd;
        this._writeChar(NexemajSpec.Comma);
        // this._lastWrittenByte = NexemajSpec.ArrayEnd;
      }
    } else {
      this._buffer.push(NexemajSpec.ArrayEnd);
      this._buffer.push(NexemajSpec.Comma);
      this._lastWrittenByte = NexemajSpec.Comma;
      this._lastWrittenChunk = BUFFER;
    }
  }

  public writeString(input: string): void {
    this._writeString(input);
    this._writeChar(NexemajSpec.Comma);
  }

  public writeKey(key: string): void {
    this._writeString(key);
    this._writeChar(NexemajSpec.Colon);
  }

  public asString(): string {
    return NexemajWriter._textDecoder.decode(this.asUint8Array());
  }

  public asUint8Array(): Uint8Array {
    let subtractLastBuffer = false;
    if (this._lastWrittenByte === NexemajSpec.Comma) {
      subtractLastBuffer = true;
    }

    if (subtractLastBuffer) {
      if (this._lastWrittenChunk === BUFFER) {
        this._buffer.pop();
        this._chunks.push(new Uint8Array(this._buffer));
        this._size += this._buffer.length;
        subtractLastBuffer = false;
      }
    } else {
      this._chunks.push(new Uint8Array(this._buffer));
      this._size += this._buffer.length;
    }

    const buffer = new Uint8Array(this._size);
    let offset = 0;
    if (subtractLastBuffer) {
      for (const chunk of this._chunks) {
        if (offset === this._lastWrittenChunk) {
          buffer.set(chunk.subarray(0, chunk.byteLength - 1), offset);
        } else {
          buffer.set(chunk, offset);
        }
        offset += chunk.byteLength;
      }
    } else {
      for (const chunk of this._chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }
    }

    // free memory
    this._chunks = [];
    this._buffer = [];
    this._size = 0;

    return buffer;
  }
}
