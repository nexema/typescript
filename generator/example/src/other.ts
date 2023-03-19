import * as $nex from 'nexema';
        export class A
  extends $nex.NexemaStruct<A>
  implements $nex.NexemaMergeable<A>, $nex.NexemaClonable<A>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "structField",
        name: "struct_field",
        value: {
          kind: "struct",
        },
      },
      1: {
        index: 1,
        jsName: "enumField",
        name: "enum_field",
        value: {
          kind: "enum",
        },
      },
      2: {
        index: 2,
        jsName: "nullStructField",
        name: "null_struct_field",
        value: {
          kind: "struct",
        },
      },
      3: {
        index: 3,
        jsName: "nullEnumField",
        name: "null_enum_field",
        value: {
          kind: "enum",
        },
      },
      4: {
        index: 4,
        jsName: "listStructField",
        name: "list_struct_field",
        value: {
          kind: "list",
        },
      },
      5: {
        index: 5,
        jsName: "listEnumField",
        name: "list_enum_field",
        value: {
          kind: "list",
        },
      },
      6: {
        index: 6,
        jsName: "mapStructField",
        name: "map_struct_field",
        value: {
          kind: "map",
        },
      },
      7: {
        index: 7,
        jsName: "mapEnumField",
        name: "map_enum_field",
        value: {
          kind: "map",
        },
      },
      8: {
        index: 8,
        jsName: "listStructNullField",
        name: "list_struct_null_field",
        value: {
          kind: "list",
        },
      },
      9: {
        index: 9,
        jsName: "listEnumNullField",
        name: "list_enum_null_field",
        value: {
          kind: "list",
        },
      },
      10: {
        index: 10,
        jsName: "mapStructNullField",
        name: "map_struct_null_field",
        value: {
          kind: "map",
        },
      },
      11: {
        index: 11,
        jsName: "mapEnumNullField",
        name: "map_enum_null_field",
        value: {
          kind: "map",
        },
      },
    },
    fieldsByJsName: {
      structField: 0,
      enumField: 1,
      nullStructField: 2,
      nullEnumField: 3,
      listStructField: 4,
      listEnumField: 5,
      mapStructField: 6,
      mapEnumField: 7,
      listStructNullField: 8,
      listEnumNullField: 9,
      mapStructNullField: 10,
      mapEnumNullField: 11,
    },
  };

  public constructor(data: {
    structField: B;
    enumField: C;
    nullStructField?: B | null;
    nullEnumField?: C | null;
    listStructField: Array<B>;
    listEnumField: Array<C>;
    mapStructField: Map<string, B>;
    mapEnumField: Map<string, C>;
    listStructNullField: Array<B | null>;
    listEnumNullField: Array<C | null>;
    mapStructNullField: Map<string, B | null>;
    mapEnumNullField: Map<string, C | null>;
  }) {
    super({
      typeInfo: A._typeInfo,
      values: [
        data.structField,
        data.enumField,
        data.nullStructField ?? null,
        data.nullEnumField ?? null,
        data.listStructField,
        data.listEnumField,
        data.mapStructField,
        data.mapEnumField,
        data.listStructNullField,
        data.listEnumNullField,
        data.mapStructNullField,
        data.mapEnumNullField,
      ],
      baseValues: undefined,
    });
  }

  public static decode(buffer: Uint8Array): A {
    const instance = new A();
    instance.mergeFrom(buffer);
    return instance;
  }

  public get structField(): B {
    return this._state.values[0] as B;
  }

  public set structField(value: B) {
    this._state.values[0] = value;
  }

  public get enumField(): C {
    return this._state.values[1] as C;
  }

  public set enumField(value: C) {
    this._state.values[1] = value;
  }

  public get nullStructField(): B | null {
    return this._state.values[2] as B | null;
  }

  public set nullStructField(value: B | null) {
    this._state.values[2] = value;
  }

  public get nullEnumField(): C | null {
    return this._state.values[3] as C | null;
  }

  public set nullEnumField(value: C | null) {
    this._state.values[3] = value;
  }

  public get listStructField(): Array<B> {
    return this._state.values[4] as Array<B>;
  }

  public set listStructField(value: Array<B>) {
    this._state.values[4] = value;
  }

  public get listEnumField(): Array<C> {
    return this._state.values[5] as Array<C>;
  }

  public set listEnumField(value: Array<C>) {
    this._state.values[5] = value;
  }

  public get mapStructField(): Map<string, B> {
    return this._state.values[6] as Map<string, B>;
  }

  public set mapStructField(value: Map<string, B>) {
    this._state.values[6] = value;
  }

  public get mapEnumField(): Map<string, C> {
    return this._state.values[7] as Map<string, C>;
  }

  public set mapEnumField(value: Map<string, C>) {
    this._state.values[7] = value;
  }

  public get listStructNullField(): Array<B | null> {
    return this._state.values[8] as Array<B | null>;
  }

  public set listStructNullField(value: Array<B | null>) {
    this._state.values[8] = value;
  }

  public get listEnumNullField(): Array<C | null> {
    return this._state.values[9] as Array<C | null>;
  }

  public set listEnumNullField(value: Array<C | null>) {
    this._state.values[9] = value;
  }

  public get mapStructNullField(): Map<string, B | null> {
    return this._state.values[10] as Map<string, B | null>;
  }

  public set mapStructNullField(value: Map<string, B | null>) {
    this._state.values[10] = value;
  }

  public get mapEnumNullField(): Map<string, C | null> {
    return this._state.values[11] as Map<string, C | null>;
  }

  public set mapEnumNullField(value: Map<string, C | null>) {
    this._state.values[11] = value;
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter();

    writer.encodeBinary(this.structField.encode());
    writer.encodeUint8(this.enumField.index);
    if (this.nullStructField) {
      writer.encodeBinary(this.nullStructField.encode());
    } else {
      writer.encodeNull();
    }
    if (this.nullEnumField) {
      writer.encodeUint8(this.nullEnumField.index);
    } else {
      writer.encodeNull();
    }
    writer.beginArray(this.listStructField.length);
    for (const value of this.listStructField) {
      writer.encodeBinary(value.encode());
    }
    writer.beginArray(this.listEnumField.length);
    for (const value of this.listEnumField) {
      writer.encodeUint8(value.index);
    }
    writer.beginMap(this.mapStructField.size);
    for (const entry of this.mapStructField.entries()) {
      writer.encodeString(entry[0]);
      writer.encodeBinary(entry[1].encode());
    }
    writer.beginMap(this.mapEnumField.size);
    for (const entry of this.mapEnumField.entries()) {
      writer.encodeString(entry[0]);
      writer.encodeUint8(entry[1].index);
    }
    writer.beginArray(this.listStructNullField.length);
    for (const value of this.listStructNullField) {
      if (value) {
        writer.encodeBinary(value.encode());
      } else {
        writer.encodeNull();
      }
    }
    writer.beginArray(this.listEnumNullField.length);
    for (const value of this.listEnumNullField) {
      if (value) {
        writer.encodeUint8(value.index);
      } else {
        writer.encodeNull();
      }
    }
    writer.beginMap(this.mapStructNullField.size);
    for (const entry of this.mapStructNullField.entries()) {
      writer.encodeString(entry[0]);
      if (entry[1]) {
        writer.encodeBinary(entry[1].encode());
      } else {
        writer.encodeNull();
      }
    }
    writer.beginMap(this.mapEnumNullField.size);
    for (const entry of this.mapEnumNullField.entries()) {
      writer.encodeString(entry[0]);
      if (entry[1]) {
        writer.encodeUint8(entry[1].index);
      } else {
        writer.encodeNull();
      }
    }
    return writer.takeBytes();
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer);
    this._state.values[0] = B.decode(reader.decodeBinary());
    this._state.values[1] = C.byIndex(reader.decodeUint8()) ?? C.unknown;
    this._state.values[2] = reader.isNextNull()
      ? null
      : B.decode(reader.decodeBinary());
    this._state.values[3] = reader.isNextNull()
      ? null
      : C.byIndex(reader.decodeUint8()) ?? C.unknown;
    this._state.values[4] = Array.from(
      { length: reader.beginDecodeArray() },
      () => B.decode(reader.decodeBinary())
    );
    this._state.values[5] = Array.from(
      { length: reader.beginDecodeArray() },
      () => C.byIndex(reader.decodeUint8()) ?? C.unknown
    );
    this._state.values[6] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        B.decode(reader.decodeBinary()),
      ])
    );
    this._state.values[7] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        C.byIndex(reader.decodeUint8()) ?? C.unknown,
      ])
    );
    this._state.values[8] = Array.from(
      { length: reader.beginDecodeArray() },
      () => (reader.isNextNull() ? null : B.decode(reader.decodeBinary()))
    );
    this._state.values[9] = Array.from(
      { length: reader.beginDecodeArray() },
      () =>
        reader.isNextNull()
          ? null
          : C.byIndex(reader.decodeUint8()) ?? C.unknown
    );
    this._state.values[10] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        reader.isNextNull() ? null : B.decode(reader.decodeBinary()),
      ])
    );
    this._state.values[11] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        reader.isNextNull()
          ? null
          : C.byIndex(reader.decodeUint8()) ?? C.unknown,
      ])
    );
  }

  public mergeUsing(other: A): void {
    this._state.values[0] = (other._state.values[0] as B).clone();
    this._state.values[1] = C.byIndex((other._state.values[1] as C).index);
    this._state.values[2] = (other._state.values[2] as B | null)?.clone();
    this._state.values[3] = C.byIndex(
      (other._state.values[3] as C | null)?.index ?? 0
    );
    this._state.values[4] = Array.from(other._state.values[4] as Array<B>, () =>
      (x as B).clone()
    );
    this._state.values[5] = Array.from(other._state.values[5] as Array<C>, () =>
      C.byIndex((x as C).index)
    );
    this._state.values[6] = new Map(
      Array.from(other._state.values[6] as Map<string, B>, ([key, value]) => [
        key,
        (value as B).clone(),
      ])
    );
    this._state.values[7] = new Map(
      Array.from(other._state.values[7] as Map<string, C>, ([key, value]) => [
        key,
        C.byIndex((value as C).index),
      ])
    );
    this._state.values[8] = Array.from(
      other._state.values[8] as Array<B | null>,
      () => (x as B | null)?.clone()
    );
    this._state.values[9] = Array.from(
      other._state.values[9] as Array<C | null>,
      () => C.byIndex((x as C | null)?.index ?? 0)
    );
    this._state.values[10] = new Map(
      Array.from(
        other._state.values[10] as Map<string, B | null>,
        ([key, value]) => [key, (value as B | null)?.clone()]
      )
    );
    this._state.values[11] = new Map(
      Array.from(
        other._state.values[11] as Map<string, C | null>,
        ([key, value]) => [key, C.byIndex((value as C | null)?.index ?? 0)]
      )
    );
  }

  public override toObject(): $nex.JsObj {
    return {
      structField: (this._state.values[0] as B).toObject(),
      enumField: (this._state.values[1] as C).index,
      nullStructField: (this._state.values[2] as B)?.toObject(),
      nullEnumField: (this._state.values[3] as C)?.index,
      listStructField: (this._state.values[4] as Array<B>).map((x) =>
        x.toObject()
      ),
      listEnumField: (this._state.values[5] as Array<C>).map((x) =>
        x.toObject()
      ),
      mapStructField: Object.fromEntries(
        Array.from(this._state.values[6] as Map<string, B>, (entry) => [
          entry[0],
          entry[1].toObject(),
        ])
      ),
      mapEnumField: Object.fromEntries(
        Array.from(this._state.values[7] as Map<string, C>, (entry) => [
          entry[0],
          entry[1].toObject(),
        ])
      ),
      listStructNullField: (this._state.values[8] as Array<B | null>).map((x) =>
        x.toObject()
      ),
      listEnumNullField: (this._state.values[9] as Array<C | null>).map((x) =>
        x.toObject()
      ),
      mapStructNullField: Object.fromEntries(
        Array.from(this._state.values[10] as Map<string, B | null>, (entry) => [
          entry[0],
          entry[1].toObject(),
        ])
      ),
      mapEnumNullField: Object.fromEntries(
        Array.from(this._state.values[11] as Map<string, C | null>, (entry) => [
          entry[0],
          entry[1].toObject(),
        ])
      ),
    };
  }

  public clone(): A {
    return new A({
      structField: (this._state.values[0] as B).clone(),
      enumField: C.byIndex((this._state.values[1] as C).index),
      nullStructField: (this._state.values[2] as B | null)?.clone(),
      nullEnumField: C.byIndex((this._state.values[3] as C | null)?.index ?? 0),
      listStructField: Array.from(this._state.values[4] as Array<B>, () =>
        (x as B).clone()
      ),
      listEnumField: Array.from(this._state.values[5] as Array<C>, () =>
        C.byIndex((x as C).index)
      ),
      mapStructField: new Map(
        Array.from(this._state.values[6] as Map<string, B>, ([key, value]) => [
          key,
          (value as B).clone(),
        ])
      ),
      mapEnumField: new Map(
        Array.from(this._state.values[7] as Map<string, C>, ([key, value]) => [
          key,
          C.byIndex((value as C).index),
        ])
      ),
      listStructNullField: Array.from(
        this._state.values[8] as Array<B | null>,
        () => (x as B | null)?.clone()
      ),
      listEnumNullField: Array.from(
        this._state.values[9] as Array<C | null>,
        () => C.byIndex((x as C | null)?.index ?? 0)
      ),
      mapStructNullField: new Map(
        Array.from(
          this._state.values[10] as Map<string, B | null>,
          ([key, value]) => [key, (value as B | null)?.clone()]
        )
      ),
      mapEnumNullField: new Map(
        Array.from(
          this._state.values[11] as Map<string, C | null>,
          ([key, value]) => [key, C.byIndex((value as C | null)?.index ?? 0)]
        )
      ),
    });
  }

  public toString(): string {
    return `A(structField: ${this._state.values[0]}, enumField: ${this._state.values[1]}, nullStructField: ${this._state.values[2]}, nullEnumField: ${this._state.values[3]}, listStructField: ${this._state.values[4]}, listEnumField: ${this._state.values[5]}, mapStructField: ${this._state.values[6]}, mapEnumField: ${this._state.values[7]}, listStructNullField: ${this._state.values[8]}, listEnumNullField: ${this._state.values[9]}, mapStructNullField: ${this._state.values[10]}, mapEnumNullField: ${this._state.values[11]})`;
  }
}
