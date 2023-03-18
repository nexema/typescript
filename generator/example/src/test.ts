
        import * as $nex from 'nexema';
        export class A
  extends $nex.NexemaStruct<A>
  implements $nex.NexemaMergeable<A>, $nex.NexemaClonable<A>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "stringField",
        name: "string_field",
        value: {
          kind: "string",
        },
      },
      1: {
        index: 1,
        jsName: "listField",
        name: "list_field",
        value: {
          kind: "list",
        },
      },
      2: {
        index: 2,
        jsName: "listValueNullField",
        name: "list_value_null_field",
        value: {
          kind: "list",
        },
      },
      3: {
        index: 3,
        jsName: "listNullField",
        name: "list_null_field",
        value: {
          kind: "list",
        },
      },
      4: {
        index: 4,
        jsName: "listBothNullField",
        name: "list_both_null_field",
        value: {
          kind: "list",
        },
      },
      5: {
        index: 5,
        jsName: "mapField",
        name: "map_field",
        value: {
          kind: "map",
        },
      },
      6: {
        index: 6,
        jsName: "mapValueNullField",
        name: "map_value_null_field",
        value: {
          kind: "map",
        },
      },
      7: {
        index: 7,
        jsName: "mapNullField",
        name: "map_null_field",
        value: {
          kind: "map",
        },
      },
      8: {
        index: 8,
        jsName: "maptBothNullField",
        name: "mapt_both_null_field",
        value: {
          kind: "map",
        },
      },
    },
    fieldsByJsName: {
      stringField: 0,
      listField: 1,
      listValueNullField: 2,
      listNullField: 3,
      listBothNullField: 4,
      mapField: 5,
      mapValueNullField: 6,
      mapNullField: 7,
      maptBothNullField: 8,
    },
  };

  public constructor(data: {
    stringField?: string | null;
    listField: Array<number>;
    listValueNullField: Array<number | null>;
    listNullField?: Array<number> | null;
    listBothNullField?: Array<number | null> | null;
    mapField: Map<string, number>;
    mapValueNullField: Map<string, number | null>;
    mapNullField?: Map<string, number> | null;
    maptBothNullField?: Map<string, number | null> | null;
  }) {
    super({
      typeInfo: A._typeInfo,
      values: [
        data.stringField ?? null,
        data.listField,
        data.listValueNullField,
        data.listNullField ?? null,
        data.listBothNullField ?? null,
        data.mapField,
        data.mapValueNullField,
        data.mapNullField ?? null,
        data.maptBothNullField ?? null,
      ],
      baseValues: undefined,
    });
  }

  public get stringField(): string | null {
    return this._state.values[0] as string | null;
  }

  public set stringField(value: string | null) {
    this._state.values[0] = value;
  }

  public get listField(): Array<number> {
    return this._state.values[1] as Array<number>;
  }

  public set listField(value: Array<number>) {
    this._state.values[1] = value;
  }

  public get listValueNullField(): Array<number | null> {
    return this._state.values[2] as Array<number | null>;
  }

  public set listValueNullField(value: Array<number | null>) {
    this._state.values[2] = value;
  }

  public get listNullField(): Array<number> | null {
    return this._state.values[3] as Array<number> | null;
  }

  public set listNullField(value: Array<number> | null) {
    this._state.values[3] = value;
  }

  public get listBothNullField(): Array<number | null> | null {
    return this._state.values[4] as Array<number | null> | null;
  }

  public set listBothNullField(value: Array<number | null> | null) {
    this._state.values[4] = value;
  }

  public get mapField(): Map<string, number> {
    return this._state.values[5] as Map<string, number>;
  }

  public set mapField(value: Map<string, number>) {
    this._state.values[5] = value;
  }

  public get mapValueNullField(): Map<string, number | null> {
    return this._state.values[6] as Map<string, number | null>;
  }

  public set mapValueNullField(value: Map<string, number | null>) {
    this._state.values[6] = value;
  }

  public get mapNullField(): Map<string, number> | null {
    return this._state.values[7] as Map<string, number> | null;
  }

  public set mapNullField(value: Map<string, number> | null) {
    this._state.values[7] = value;
  }

  public get maptBothNullField(): Map<string, number | null> | null {
    return this._state.values[8] as Map<string, number | null> | null;
  }

  public set maptBothNullField(value: Map<string, number | null> | null) {
    this._state.values[8] = value;
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter();

    if (this.stringField) {
      writer.encodeString(this.stringField);
    } else {
      writer.encodeNull();
    }
    writer.beginArray(this.listField.length);
    for (const value of this.listField) {
      writer.encodeFloat32(value);
    }
    writer.beginArray(this.listValueNullField.length);
    for (const value of this.listValueNullField) {
      if (value) {
        writer.encodeFloat32(value);
      } else {
        writer.encodeNull();
      }
    }
    if (this.listNullField) {
      writer.beginArray(this.listNullField.length);
      for (const value of this.listNullField) {
        writer.encodeFloat32(value);
      }
    } else {
      writer.encodeNull();
    }
    if (this.listBothNullField) {
      writer.beginArray(this.listBothNullField.length);
      for (const value of this.listBothNullField) {
        if (value) {
          writer.encodeFloat32(value);
        } else {
          writer.encodeNull();
        }
      }
    } else {
      writer.encodeNull();
    }
    writer.beginMap(this.mapField.size);
    for (const entry of this.mapField.entries()) {
      writer.encodeString(entry[0]);
      writer.encodeFloat32(entry[1]);
    }
    writer.beginMap(this.mapValueNullField.size);
    for (const entry of this.mapValueNullField.entries()) {
      writer.encodeString(entry[0]);
      if (entry[1]) {
        writer.encodeFloat32(entry[1]);
      } else {
        writer.encodeNull();
      }
    }
    if (this.mapNullField) {
      writer.beginMap(this.mapNullField.size);
      for (const entry of this.mapNullField.entries()) {
        writer.encodeString(entry[0]);
        writer.encodeFloat32(entry[1]);
      }
    } else {
      writer.encodeNull();
    }
    if (this.maptBothNullField) {
      writer.beginMap(this.maptBothNullField.size);
      for (const entry of this.maptBothNullField.entries()) {
        writer.encodeString(entry[0]);
        if (entry[1]) {
          writer.encodeFloat32(entry[1]);
        } else {
          writer.encodeNull();
        }
      }
    } else {
      writer.encodeNull();
    }
    return writer.takeBytes();
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer);
    this._state.values[0] = reader.isNextNull() ? null : reader.decodeString();
    this._state.values[1] = Array.from(
      { length: reader.beginDecodeArray() },
      () => reader.decodeFloat32()
    );
    this._state.values[2] = Array.from(
      { length: reader.beginDecodeArray() },
      () => (reader.isNextNull() ? null : reader.decodeFloat32())
    );
    this._state.values[3] = reader.isNextNull()
      ? null
      : Array.from({ length: reader.beginDecodeArray() }, () =>
          reader.decodeFloat32()
        );
    this._state.values[4] = reader.isNextNull()
      ? null
      : Array.from({ length: reader.beginDecodeArray() }, () =>
          reader.isNextNull() ? null : reader.decodeFloat32()
        );
    this._state.values[5] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        reader.decodeString(),
      ])
    );
    this._state.values[6] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        reader.decodeString(),
      ])
    );
    this._state.values[7] = reader.isNextNull()
      ? null
      : new Map(
          Array.from({ length: reader.beginDecodeMap() }, () => [
            reader.decodeString(),
            reader.decodeString(),
          ])
        );
    this._state.values[8] = reader.isNextNull()
      ? null
      : new Map(
          Array.from({ length: reader.beginDecodeMap() }, () => [
            reader.decodeString(),
            reader.decodeString(),
          ])
        );
  }

  public mergeUsing(other: A): void {
    this._state.values[0] = other._state.values[0];
    this._state.values[1] = Array.from(other._state.values[1] as Array<number>);
    this._state.values[2] = Array.from(
      other._state.values[2] as Array<number | null>
    );
    this._state.values[3] = (other._state.values[3] as Array<number> | null)
      ? Array.from(other._state.values[3] as Array<number>)
      : null;
    this._state.values[4] = (other._state.values[4] as Array<
      number | null
    > | null)
      ? Array.from(other._state.values[4] as Array<number | null>)
      : null;
    this._state.values[5] = new Map(
      other._state.values[5] as Map<string, number>
    );
    this._state.values[6] = new Map(
      other._state.values[6] as Map<string, number | null>
    );
    this._state.values[7] = (other._state.values[7] as Map<
      string,
      number
    > | null)
      ? new Map(other._state.values[7] as Map<string, number>)
      : null;
    this._state.values[8] = (other._state.values[8] as Map<
      string,
      number | null
    > | null)
      ? new Map(other._state.values[8] as Map<string, number | null>)
      : null;
  }

  public override toObject(): $nex.JsObj {
    return {
      stringField: this._state.values[0] as string | null,
      listField: Array.from(this._state.values[1] as Array<number>),
      listValueNullField: Array.from(
        this._state.values[2] as Array<number | null>
      ),
      listNullField: (this._state.values[3] as Array<number> | null)
        ? Array.from(this._state.values[3] as Array<number>)
        : null,
      listBothNullField: (this._state.values[4] as Array<number | null> | null)
        ? Array.from(this._state.values[4] as Array<number | null>)
        : null,
      mapField: Object.fromEntries(
        this._state.values[5] as Map<string, number>
      ),
      mapValueNullField: Object.fromEntries(
        this._state.values[6] as Map<string, number | null>
      ),
      mapNullField: (this._state.values[7] as Map<string, number> | null)
        ? Object.fromEntries(this._state.values[7] as Map<string, number>)
        : null,
      maptBothNullField: (this._state.values[8] as Map<
        string,
        number | null
      > | null)
        ? Object.fromEntries(
            this._state.values[8] as Map<string, number | null>
          )
        : null,
    };
  }

  public clone(): A {
    return new A({
      stringField: this._state.values[0] as string | null,
      listField: Array.from(this._state.values[1] as Array<number>),
      listValueNullField: Array.from(
        this._state.values[2] as Array<number | null>
      ),
      listNullField: (this._state.values[3] as Array<number> | null)
        ? Array.from(this._state.values[3] as Array<number>)
        : null,
      listBothNullField: (this._state.values[4] as Array<number | null> | null)
        ? Array.from(this._state.values[4] as Array<number | null>)
        : null,
      mapField: new Map(this._state.values[5] as Map<string, number>),
      mapValueNullField: new Map(
        this._state.values[6] as Map<string, number | null>
      ),
      mapNullField: (this._state.values[7] as Map<string, number> | null)
        ? new Map(this._state.values[7] as Map<string, number>)
        : null,
      maptBothNullField: (this._state.values[8] as Map<
        string,
        number | null
      > | null)
        ? new Map(this._state.values[8] as Map<string, number | null>)
        : null,
    });
  }

  public toString(): string {
    return `A(stringField: ${this._state.values[0]}, listField: ${this._state.values[1]}, listValueNullField: ${this._state.values[2]}, listNullField: ${this._state.values[3]}, listBothNullField: ${this._state.values[4]}, mapField: ${this._state.values[5]}, mapValueNullField: ${this._state.values[6]}, mapNullField: ${this._state.values[7]}, maptBothNullField: ${this._state.values[8]})`;
  }
}
