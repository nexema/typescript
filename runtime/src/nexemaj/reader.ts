import { JsObj } from "../primitives";
import { JsonType, NexemajSpec, TokenType } from "./spec";

export class NexemajReader {
  private static readonly _textDecoder: TextDecoder = new TextDecoder();

  private _buffer: Uint8Array;
  private _offset: number;
  private _currentToken: number;

  constructor(buffer: Uint8Array) {
    this._buffer = buffer;
    this._offset = 0;
    this._currentToken = this._buffer[this._offset];
  }

  private _nextToken(): void {
    this._offset++;
    this._currentToken = this._buffer[this._offset];
  }

  private _stepInto(offset: number): void {
    this._offset = offset;
    this._currentToken = this._buffer[this._offset];
  }

  private _expect(token: number): void {
    if (this._currentToken !== token) {
      throw `Expected character at ${this._offset} to be ${String.fromCharCode(
        token
      )}, got ${String.fromCharCode(this._currentToken)}`;
    }
  }

  private _isNumber(input: number): boolean {
    // 44 = "-"
    // 58 = "9"
    return input > 44 && input < 58;
  }

  public next(): void {
    this._nextToken();
    while (
      this._currentToken === NexemajSpec.Newline ||
      this._currentToken === NexemajSpec.Tab ||
      this._currentToken === NexemajSpec.Carriage ||
      this._currentToken === NexemajSpec.Space
    ) {
      this._nextToken();
    }
  }

  public whichToken(): TokenType {
    switch (this._currentToken) {
      case NexemajSpec.Quotes:
        return TokenType.QUOTE;

      case NexemajSpec.Colon:
        return TokenType.COLON;

      case NexemajSpec.Comma:
        return TokenType.COMMA;

      case NexemajSpec.ArrayStart:
        return TokenType.ARRAY_START;

      case NexemajSpec.ArrayEnd:
        return TokenType.ARRAY_END;

      case NexemajSpec.ObjectStart:
        return TokenType.OBJECT_START;

      case NexemajSpec.ObjectEnd:
        return TokenType.OBJECT_END;

      default:
        return TokenType.INVALID;
    }
  }

  public whichType(): JsonType {
    switch (this._currentToken) {
      case NexemajSpec.ArrayStart:
        return JsonType.ARRAY;

      case NexemajSpec.ObjectStart:
        return JsonType.OBJECT;

      case NexemajSpec.LetterT:
        return JsonType.BOOLEAN_TRUE;

      case NexemajSpec.LetterF:
        return JsonType.BOOLEAN_FALSE;

      case NexemajSpec.LetterN:
        return JsonType.NULL;

      case NexemajSpec.Quotes:
        return JsonType.STRING;

      default:
        return JsonType.NUMBER;
    }
  }

  public readString(): string {
    // skip first quote
    this.next();

    const start = this._offset;
    while (this._currentToken !== NexemajSpec.Quotes) {
      this._nextToken();
    }

    const end = this._offset;
    const input = NexemajReader._textDecoder.decode(
      this._buffer.subarray(start, end)
    );

    this.next();

    return input;
  }

  public readBoolean(): boolean {
    if (this._currentToken === NexemajSpec.LetterF) {
      this._stepInto(this._offset + 5);
      return false;
    } else {
      this._stepInto(this._offset + 4);
      return true;
    }
  }

  public readNull(): null {
    this._stepInto(this._offset + 4);
    return null;
  }

  public readNumber(): number {
    const start = this._offset;
    while (this._isNumber(this._currentToken)) {
      this._nextToken();
    }
    const end = this._offset;
    return Number(
      NexemajReader._textDecoder.decode(this._buffer.subarray(start, end))
    );
  }

  public readObject(): { [key: string | number]: JsObj } {
    const obj = {} as { [key: string]: JsObj };
    this.next();
    while (this._currentToken !== NexemajSpec.ObjectEnd) {
      const key = this.readString();
      this.next(); // Consume the ':' token
      const value = this.read();

      if (this._currentToken === NexemajSpec.Comma) {
        this.next(); // Consume the ',' token
      } else if (this._currentToken !== NexemajSpec.ObjectEnd) {
        throw new Error(
          `[Pos ${
            this._offset
          }] Expected ',' or '}' but got ${String.fromCharCode(
            this._currentToken
          )}`
        );
      }

      obj[key] = value;
    }

    this.next(); // consume the }

    return obj;
  }

  public readArray(): JsObj[] {
    const array = [] as JsObj[];
    this.next();
    while (this._currentToken !== NexemajSpec.ArrayEnd) {
      const value = this.read();

      if (this._currentToken === NexemajSpec.Comma) {
        this.next();
      } else if (this._currentToken !== NexemajSpec.ArrayEnd) {
        throw new Error(
          `Expected ',' or ']' but got ${String.fromCharCode(
            this._currentToken
          )}`
        );
      }

      array.push(value);
    }

    this.next(); // consume the ]
    return array;
  }

  /**
   * Reads a JSON object.
   *
   * @returns The parsed object.
   */
  public read(): JsObj {
    switch (this.whichType()) {
      case JsonType.STRING:
        return this.readString();

      case JsonType.BOOLEAN_TRUE:
      case JsonType.BOOLEAN_FALSE:
        return this.readBoolean();

      case JsonType.NUMBER:
        return this.readNumber();

      case JsonType.NULL:
        return this.readNull();

      case JsonType.OBJECT:
        return this.readObject();

      case JsonType.ARRAY:
        return this.readArray();
    }
  }
}
