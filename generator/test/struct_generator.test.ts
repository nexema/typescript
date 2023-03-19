import { CommonTypes } from '../src/constants'
import { Generator } from '../src/generator'
import { NexemaFile, NexemaPrimitiveValueType } from '../src/models'
import { StructGenerator } from '../src/struct_generator'
import {
    DefaultGenerateContext,
    formatSource,
    getBaseType,
    getEnum,
    getField,
    getListValueType,
    getMapValueType,
    getPrimitiveValueType,
    getStruct,
    getTypeValueType,
} from './test_utils'

describe('StructGenerator', () => {
    it('should generate a struct class', () => {
        const generator = new StructGenerator(
            {
                id: '1',
                name: 'MyStruct',
                fields: [
                    {
                        index: 0,
                        name: 'string_field',
                        type: {
                            kind: 'primitiveValueType',
                            nullable: false,
                            primitive: 'string',
                        } as NexemaPrimitiveValueType,
                        annotations: {},
                        documentation: [],
                    },
                    {
                        index: 1,
                        name: 'bool_field',
                        type: {
                            kind: 'primitiveValueType',
                            nullable: false,
                            primitive: 'boolean',
                        } as NexemaPrimitiveValueType,
                        annotations: {},
                        documentation: [],
                    },
                    {
                        index: 2,
                        name: 'list_field',
                        type: {
                            kind: 'primitiveValueType',
                            nullable: false,
                            primitive: 'list',
                            arguments: [
                                {
                                    kind: 'primitiveValueType',
                                    nullable: true,
                                    primitive: 'float32',
                                } as NexemaPrimitiveValueType,
                            ],
                        } as NexemaPrimitiveValueType,
                        annotations: {},
                        documentation: [],
                    },
                ],
                modifier: 'struct',
                baseType: null,
                annotations: {},
                defaults: {
                    bool_field: true,
                },
                documentation: [],
            },
            {
                fileName: 'struct.nex',
                id: 'abc',
                packageName: 'root',
                path: 'struct.nex',
                types: [],
            },
            DefaultGenerateContext
        )

        const want = `export class MyStruct extends $nex.NexemaStruct<MyStruct> implements $nex.NexemaMergeable<MyStruct>, $nex.NexemaClonable<MyStruct> {
    
            private static readonly _typeInfo: $nex.NexemaTypeInfo = {
                fieldsByIndex: {
                    0: {
                        index: 0,
                        jsName: "stringField",
                        name: "string_field",
                        value: {
                            kind: "string"
                        }
                    },
                    1: {
                        index: 1,
                        jsName: "boolField",
                        name: "bool_field",
                        value: {
                            kind: "boolean"
                        }
                    },
                    2: {
                        index: 2,
                        jsName: "listField",
                        name: "list_field",
                        value: {
                            kind: "list"
                        }
                    }
                },
                fieldsByJsName: {
                    stringField: 0,
                    boolField: 1,
                    listField: 2
                }
            };
    
            public constructor(data: {
                stringField: string,
                boolField?: boolean,
                listField: Array<number | null>
            }) {
                super({
                    typeInfo: MyStruct._typeInfo,
                    values: [
                        data.stringField,
                        data.boolField ?? true,
                        data.listField
                    ],
                    baseValues: undefined
                });
            }

            public static decode(buffer: Uint8Array): MyStruct {
              const instance = new MyStruct();
              instance.mergeFrom(buffer);
              return instance;
            }
    
            public get stringField(): string {
                return this._state.values[0] as string;
            }
    
            public set stringField(value: string) {
                this._state.values[0] = value;
            }
    
            public get boolField(): boolean {
                return this._state.values[1] as boolean;
            }
    
            public set boolField(value: boolean) {
                this._state.values[1] = value;
            }
    
            public get listField(): Array<number | null> {
                return this._state.values[2] as Array<number | null>;
            }
    
            public set listField(value: Array<number | null>) {
                this._state.values[2] = value;
            }
    
            public override encode(): Uint8Array {
                const writer = new $nex.NexemabWriter();

                writer.encodeString(this._state.values[0] as string);
                writer.encodeBool(this._state.values[1] as boolean);
                writer.beginArray((this._state.values[2] as Array<number | null>).length);
                for(const value of this._state.values[2] as Array<number | null>) {
                    if(value) {
                        writer.encodeFloat32(value as number);
                    } else {
                        writer.encodeNull();
                    }
                }
                return writer.takeBytes();
            }
    
            public mergeFrom(buffer: Uint8Array): void {
                const reader = new $nex.NexemabReader(buffer);
                this._state.values[0] = reader.decodeString();
                this._state.values[1] = reader.decodeBool();
                this._state.values[2] = Array.from({length: reader.beginDecodeArray()}, () => reader.isNextNull() ? null : reader.decodeFloat32());
            }
    
            public mergeUsing(other: MyStruct): void {
                this._state.values[0] = other._state.values[0]
                this._state.values[1] = other._state.values[1]
                this._state.values[2] = Array.from(other._state.values[2] as Array<number | null>)
            }
    
            public override toObject(): ${CommonTypes.JsObj} {
                return {
                    stringField: this._state.values[0] as string,
                    boolField: this._state.values[1] as boolean,
                    listField: Array.from(this._state.values[2] as Array<number | null>)
                }
            }
    
            public clone(): MyStruct {
                return new MyStruct({
                    stringField: this._state.values[0] as string,
                    boolField: this._state.values[1] as boolean,
                    listField: Array.from(this._state.values[2] as Array<number | null>)
                });
            }
    
            public toString(): string {
                return \`MyStruct(stringField: \${this._state.values[0]}, boolField: \${this._state.values[1]}, listField: \${this._state.values[2]})\`
            }
        }`

        const got = formatSource(generator.generate())
        expect(got).toStrictEqual(formatSource(want))
    })

    it('should generate struct with every primitive', () => {
        const generator = new StructGenerator(
            getStruct({
                name: 'A',
                fields: [
                    getField(0, 'string_field', getPrimitiveValueType('string'), {
                        documentation: ['A string field'],
                    }),
                    getField(1, 'bool_field', getPrimitiveValueType('boolean')),
                    getField(2, 'int_field', getPrimitiveValueType('int')),
                    getField(3, 'int8_field', getPrimitiveValueType('int8')),
                    getField(4, 'int16_field', getPrimitiveValueType('int16')),
                    getField(5, 'int32_field', getPrimitiveValueType('int32')),
                    getField(6, 'int64_field', getPrimitiveValueType('int64')),
                    getField(7, 'uint_field', getPrimitiveValueType('uint')),
                    getField(8, 'uint8_field', getPrimitiveValueType('uint8')),
                    getField(9, 'uint16_field', getPrimitiveValueType('uint16')),
                    getField(10, 'uint32_field', getPrimitiveValueType('uint32')),
                    getField(11, 'uint64_field', getPrimitiveValueType('uint64')),
                    getField(12, 'float32_field', getPrimitiveValueType('float32')),
                    getField(13, 'float64_field', getPrimitiveValueType('float64')),
                    getField(14, 'binary_field', getPrimitiveValueType('binary'), {
                        annotations: {
                            obsolete: true,
                        },
                    }),
                    getField(15, 'timestamp_field', getPrimitiveValueType('timestamp')),
                    getField(16, 'duration_field', getPrimitiveValueType('duration')),
                ],
                annotations: {
                    obsolete: true,
                },
                documentation: ['This is a documentation line', 'this is another one'],
            }),
            {
                id: '1',
                fileName: 'a.nex',
                path: 'root/a.nex',
                packageName: 'root',
                types: [],
            },
            DefaultGenerateContext
        )

        const want = `
        /**
        * This is a documentation line
        * this is another one
        * @deprecated This class is deprecated and should not be used
        */
        export class A extends $nex.NexemaStruct<A> implements $nex.NexemaMergeable<A>, $nex.NexemaClonable<A> {

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
            jsName: "boolField",
            name: "bool_field",
            value: {
              kind: "boolean",
            },
          },
          2: {
            index: 2,
            jsName: "intField",
            name: "int_field",
            value: {
              kind: "int",
            },
          },
          3: {
            index: 3,
            jsName: "int8Field",
            name: "int8_field",
            value: {
              kind: "int8",
            },
          },
          4: {
            index: 4,
            jsName: "int16Field",
            name: "int16_field",
            value: {
              kind: "int16",
            },
          },
          5: {
            index: 5,
            jsName: "int32Field",
            name: "int32_field",
            value: {
              kind: "int32",
            },
          },
          6: {
            index: 6,
            jsName: "int64Field",
            name: "int64_field",
            value: {
              kind: "int64",
            },
          },
          7: {
            index: 7,
            jsName: "uintField",
            name: "uint_field",
            value: {
              kind: "uint",
            },
          },
          8: {
            index: 8,
            jsName: "uint8Field",
            name: "uint8_field",
            value: {
              kind: "uint8",
            },
          },
          9: {
            index: 9,
            jsName: "uint16Field",
            name: "uint16_field",
            value: {
              kind: "uint16",
            },
          },
          10: {
            index: 10,
            jsName: "uint32Field",
            name: "uint32_field",
            value: {
              kind: "uint32",
            },
          },
          11: {
            index: 11,
            jsName: "uint64Field",
            name: "uint64_field",
            value: {
              kind: "uint64",
            },
          },
          12: {
            index: 12,
            jsName: "float32Field",
            name: "float32_field",
            value: {
              kind: "float32",
            },
          },
          13: {
            index: 13,
            jsName: "float64Field",
            name: "float64_field",
            value: {
              kind: "float64",
            },
          },
          14: {
            index: 14,
            jsName: "binaryField",
            name: "binary_field",
            value: {
              kind: "binary",
            },
          },
          15: {
            index: 15,
            jsName: "timestampField",
            name: "timestamp_field",
            value: {
              kind: "timestamp",
            },
          },
          16: {
            index: 16,
            jsName: "durationField",
            name: "duration_field",
            value: {
              kind: "duration",
            },
          },
        },
        fieldsByJsName: {
          stringField: 0,
          boolField: 1,
          intField: 2,
          int8Field: 3,
          int16Field: 4,
          int32Field: 5,
          int64Field: 6,
          uintField: 7,
          uint8Field: 8,
          uint16Field: 9,
          uint32Field: 10,
          uint64Field: 11,
          float32Field: 12,
          float64Field: 13,
          binaryField: 14,
          timestampField: 15,
          durationField: 16,
        },
      };
    
      public constructor(data: {
        stringField: string;
        boolField: boolean;
        intField: bigint;
        int8Field: number;
        int16Field: number;
        int32Field: number;
        int64Field: bigint;
        uintField: bigint;
        uint8Field: number;
        uint16Field: number;
        uint32Field: number;
        uint64Field: bigint;
        float32Field: number;
        float64Field: number;
        binaryField: Uint8Array;
        timestampField: Date;
        durationField: bigint;
      }) {
        super({
          typeInfo: A._typeInfo,
          values: [
            data.stringField,
            data.boolField,
            data.intField,
            data.int8Field,
            data.int16Field,
            data.int32Field,
            data.int64Field,
            data.uintField,
            data.uint8Field,
            data.uint16Field,
            data.uint32Field,
            data.uint64Field,
            data.float32Field,
            data.float64Field,
            data.binaryField,
            data.timestampField,
            data.durationField,
          ],
          baseValues: undefined,
        });
      }

      public static decode(buffer: Uint8Array): A {
        const instance = new A();
        instance.mergeFrom(buffer);
        return instance;
      }
    
      /**
       * A string field
       */
      public get stringField(): string {
        return this._state.values[0] as string;
      }
      /**
       * A string field
       */
      public set stringField(value: string) {
        this._state.values[0] = value;
      }
    
      public get boolField(): boolean {
        return this._state.values[1] as boolean;
      }
    
      public set boolField(value: boolean) {
        this._state.values[1] = value;
      }
    
      public get intField(): bigint {
        return this._state.values[2] as bigint;
      }
    
      public set intField(value: bigint) {
        this._state.values[2] = value;
      }
    
      public get int8Field(): number {
        return this._state.values[3] as number;
      }
    
      public set int8Field(value: number) {
        this._state.values[3] = value;
      }
    
      public get int16Field(): number {
        return this._state.values[4] as number;
      }
    
      public set int16Field(value: number) {
        this._state.values[4] = value;
      }
    
      public get int32Field(): number {
        return this._state.values[5] as number;
      }
    
      public set int32Field(value: number) {
        this._state.values[5] = value;
      }
    
      public get int64Field(): bigint {
        return this._state.values[6] as bigint;
      }
    
      public set int64Field(value: bigint) {
        this._state.values[6] = value;
      }
    
      public get uintField(): bigint {
        return this._state.values[7] as bigint;
      }
    
      public set uintField(value: bigint) {
        this._state.values[7] = value;
      }
    
      public get uint8Field(): number {
        return this._state.values[8] as number;
      }
    
      public set uint8Field(value: number) {
        this._state.values[8] = value;
      }
    
      public get uint16Field(): number {
        return this._state.values[9] as number;
      }
    
      public set uint16Field(value: number) {
        this._state.values[9] = value;
      }
    
      public get uint32Field(): number {
        return this._state.values[10] as number;
      }
    
      public set uint32Field(value: number) {
        this._state.values[10] = value;
      }
    
      public get uint64Field(): bigint {
        return this._state.values[11] as bigint;
      }
    
      public set uint64Field(value: bigint) {
        this._state.values[11] = value;
      }
    
      public get float32Field(): number {
        return this._state.values[12] as number;
      }
    
      public set float32Field(value: number) {
        this._state.values[12] = value;
      }
    
      public get float64Field(): number {
        return this._state.values[13] as number;
      }
    
      public set float64Field(value: number) {
        this._state.values[13] = value;
      }
      /**
       * @deprecated This field is deprecated and should not be used
       */
      public get binaryField(): Uint8Array {
        return this._state.values[14] as Uint8Array;
      }
      /**
       * @deprecated This field is deprecated and should not be used
       */
      public set binaryField(value: Uint8Array) {
        this._state.values[14] = value;
      }
    
      public get timestampField(): Date {
        return this._state.values[15] as Date;
      }
    
      public set timestampField(value: Date) {
        this._state.values[15] = value;
      }
    
      public get durationField(): bigint {
        return this._state.values[16] as bigint;
      }
    
      public set durationField(value: bigint) {
        this._state.values[16] = value;
      }
    
      public override encode(): Uint8Array {
        const writer = new $nex.NexemabWriter();
    
        writer.encodeString(this._state.values[0] as string);
        writer.encodeBool(this._state.values[1] as boolean);
        writer.encodeVarint(this._state.values[2] as bigint);
        writer.encodeInt8(this._state.values[3] as number);
        writer.encodeInt16(this._state.values[4] as number);
        writer.encodeInt32(this._state.values[5] as number);
        writer.encodeInt64(this._state.values[6] as bigint);
        writer.encodeUvarint(this._state.values[7] as bigint);
        writer.encodeUint8(this._state.values[8] as number);
        writer.encodeUint16(this._state.values[9] as number);
        writer.encodeUint32(this._state.values[10] as number);
        writer.encodeUint64(this._state.values[11] as bigint);
        writer.encodeFloat32(this._state.values[12] as number);
        writer.encodeFloat64(this._state.values[13] as number);
        writer.encodeBinary(this._state.values[14] as Uint8Array);
        writer.encodeTimestamp(this._state.values[15] as Date);
        writer.encodeDuration(this._state.values[16] as bigint);
        return writer.takeBytes();
      }
    
      public mergeFrom(buffer: Uint8Array): void {
        const reader = new $nex.NexemabReader(buffer);
        this._state.values[0] = reader.decodeString();
        this._state.values[1] = reader.decodeBool();
        this._state.values[2] = reader.decodeVarint();
        this._state.values[3] = reader.decodeInt8();
        this._state.values[4] = reader.decodeInt16();
        this._state.values[5] = reader.decodeInt32();
        this._state.values[6] = reader.decodeInt64();
        this._state.values[7] = reader.decodeUvarint();
        this._state.values[8] = reader.decodeUint8();
        this._state.values[9] = reader.decodeUint16();
        this._state.values[10] = reader.decodeUint32();
        this._state.values[11] = reader.decodeUint64();
        this._state.values[12] = reader.decodeFloat32();
        this._state.values[13] = reader.decodeFloat64();
        this._state.values[14] = reader.decodeBinary();
        this._state.values[15] = reader.decodeTimestamp();
        this._state.values[16] = reader.decodeDuration();
      }
    
      public mergeUsing(other: A): void {
        this._state.values[0] = other._state.values[0];
        this._state.values[1] = other._state.values[1];
        this._state.values[2] = other._state.values[2];
        this._state.values[3] = other._state.values[3];
        this._state.values[4] = other._state.values[4];
        this._state.values[5] = other._state.values[5];
        this._state.values[6] = other._state.values[6];
        this._state.values[7] = other._state.values[7];
        this._state.values[8] = other._state.values[8];
        this._state.values[9] = other._state.values[9];
        this._state.values[10] = other._state.values[10];
        this._state.values[11] = other._state.values[11];
        this._state.values[12] = other._state.values[12];
        this._state.values[13] = other._state.values[13];
        this._state.values[14] = new Uint8Array(
          other._state.values[14] as Uint8Array
        );
        this._state.values[15] = new Date(other._state.values[15] as Date);
        this._state.values[16] = other._state.values[16];
      }
    
      public override toObject(): $nex.JsObj {
        return {
          stringField: this._state.values[0] as string,
          boolField: this._state.values[1] as boolean,
          intField: this._state.values[2] as bigint,
          int8Field: this._state.values[3] as number,
          int16Field: this._state.values[4] as number,
          int32Field: this._state.values[5] as number,
          int64Field: this._state.values[6] as bigint,
          uintField: this._state.values[7] as bigint,
          uint8Field: this._state.values[8] as number,
          uint16Field: this._state.values[9] as number,
          uint32Field: this._state.values[10] as number,
          uint64Field: this._state.values[11] as bigint,
          float32Field: this._state.values[12] as number,
          float64Field: this._state.values[13] as number,
          binaryField: this._state.values[14] as Uint8Array,
          timestampField: this._state.values[15] as Date,
          durationField: this._state.values[16] as bigint,
        };
      }
    
      public clone(): A {
        return new A({
          stringField: this._state.values[0] as string,
          boolField: this._state.values[1] as boolean,
          intField: this._state.values[2] as bigint,
          int8Field: this._state.values[3] as number,
          int16Field: this._state.values[4] as number,
          int32Field: this._state.values[5] as number,
          int64Field: this._state.values[6] as bigint,
          uintField: this._state.values[7] as bigint,
          uint8Field: this._state.values[8] as number,
          uint16Field: this._state.values[9] as number,
          uint32Field: this._state.values[10] as number,
          uint64Field: this._state.values[11] as bigint,
          float32Field: this._state.values[12] as number,
          float64Field: this._state.values[13] as number,
          binaryField: new Uint8Array(this._state.values[14] as Uint8Array),
          timestampField: new Date(this._state.values[15] as Date),
          durationField: this._state.values[16] as bigint,
        });
      }
    
      public toString(): string {
        return \`A(stringField: \${this._state.values[0]}, boolField: \${this._state.values[1]}, intField: \${this._state.values[2]}, int8Field: \${this._state.values[3]}, int16Field: \${this._state.values[4]}, int32Field: \${this._state.values[5]}, int64Field: \${this._state.values[6]}, uintField: \${this._state.values[7]}, uint8Field: \${this._state.values[8]}, uint16Field: \${this._state.values[9]}, uint32Field: \${this._state.values[10]}, uint64Field: \${this._state.values[11]}, float32Field: \${this._state.values[12]}, float64Field: \${this._state.values[13]}, binaryField: \${this._state.values[14]}, timestampField: \${this._state.values[15]}, durationField: \${this._state.values[16]})\`
      }
    }`

        const got = formatSource(generator.generate())
        expect(got).toStrictEqual(formatSource(want))
    })

    it('should generate struct with list, map and nullable', () => {
        const generator = new StructGenerator(
            getStruct({
                name: 'A',
                fields: [
                    getField(0, 'string_field', getPrimitiveValueType('string', true)),
                    getField(1, 'list_field', getListValueType(getPrimitiveValueType('float32'))),
                    getField(
                        2,
                        'list_value_null_field',
                        getListValueType(getPrimitiveValueType('float32', true))
                    ),
                    getField(
                        3,
                        'list_null_field',
                        getListValueType(getPrimitiveValueType('float32'), true)
                    ),
                    getField(
                        4,
                        'list_both_null_field',
                        getListValueType(getPrimitiveValueType('float32', true), true)
                    ),
                    getField(
                        5,
                        'map_field',
                        getMapValueType(
                            getPrimitiveValueType('string'),
                            getPrimitiveValueType('float32')
                        )
                    ),
                    getField(
                        6,
                        'map_value_null_field',
                        getMapValueType(
                            getPrimitiveValueType('string'),
                            getPrimitiveValueType('float32', true)
                        )
                    ),
                    getField(
                        7,
                        'map_null_field',
                        getMapValueType(
                            getPrimitiveValueType('string'),
                            getPrimitiveValueType('float32'),
                            true
                        )
                    ),
                    getField(
                        8,
                        'mapt_both_null_field',
                        getMapValueType(
                            getPrimitiveValueType('string'),
                            getPrimitiveValueType('float32', true),
                            true
                        )
                    ),
                ],
            }),
            {
                id: '1',
                fileName: 'a.nex',
                path: 'root/a.nex',
                packageName: 'root',
                types: [],
            },
            DefaultGenerateContext
        )

        const want = `export class A
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

        public static decode(buffer: Uint8Array): A {
          const instance = new A();
          instance.mergeFrom(buffer);
          return instance;
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
      
          if (this._state.values[0] as string | null) {
            writer.encodeString(this._state.values[0] as string);
          } else {
            writer.encodeNull();
          }
          writer.beginArray((this._state.values[1] as Array<number>).length);
          for (const value of this._state.values[1] as Array<number>) {
            writer.encodeFloat32(value);
          }
          writer.beginArray((this._state.values[2] as Array<number | null>).length);
          for (const value of this._state.values[2] as Array<number | null>) {
            if (value) {
              writer.encodeFloat32(value  as number);
            } else {
              writer.encodeNull();
            }
          }
          if (this._state.values[3] as Array<number> | null) {
            writer.beginArray((this._state.values[3] as Array<number>).length);
            for (const value of this._state.values[3] as Array<number>) {
              writer.encodeFloat32(value);
            }
          } else {
            writer.encodeNull();
          }
          if (this._state.values[4] as Array<number | null> | null) {
            writer.beginArray((this._state.values[4] as Array<number | null>).length);
            for (const value of this._state.values[4] as Array<number | null>) {
              if (value) {
                writer.encodeFloat32(value  as number);
              } else {
                writer.encodeNull();
              }
            }
          } else {
            writer.encodeNull();
          }
          writer.beginMap((this._state.values[5] as Map<string, number>).size);
          for (const entry of (this._state.values[5] as Map<string, number>).entries()) {
            writer.encodeString(entry[0]);
            writer.encodeFloat32(entry[1]);
          }
          writer.beginMap((this._state.values[6] as Map<string, number | null>).size);
          for (const entry of (this._state.values[6] as Map<string, number | null>).entries()) {
            writer.encodeString(entry[0]);
            if (entry[1]) {
              writer.encodeFloat32(entry[1]  as number);
            } else {
              writer.encodeNull();
            }
          }
          if (this._state.values[7] as Map<string, number> | null) {
            writer.beginMap((this._state.values[7] as Map<string, number>).size);
            for (const entry of (this._state.values[7] as Map<string, number>).entries()) {
              writer.encodeString(entry[0]);
              writer.encodeFloat32(entry[1]);
            }
          } else {
            writer.encodeNull();
          }
          if (this._state.values[8] as Map<string, number | null> | null) {
            writer.beginMap((this._state.values[8] as Map<string, number | null>).size);
            for (const entry of (this._state.values[8] as Map<string, number | null>).entries()) {
              writer.encodeString(entry[0]);
              if (entry[1]) {
                writer.encodeFloat32(entry[1] as number);
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
              reader.decodeFloat32(),
            ])
          );
          this._state.values[6] = new Map(
            Array.from({ length: reader.beginDecodeMap() }, () => [
              reader.decodeString(),
              reader.isNextNull() ? null : reader.decodeFloat32(),
            ])
          );
          this._state.values[7] = reader.isNextNull()
            ? null
            : new Map(
                Array.from({ length: reader.beginDecodeMap() }, () => [
                  reader.decodeString(),
                  reader.decodeFloat32(),
                ])
              );
          this._state.values[8] = reader.isNextNull()
            ? null
            : new Map(
                Array.from({ length: reader.beginDecodeMap() }, () => [
                  reader.decodeString(),
                  reader.isNextNull() ? null : reader.decodeFloat32(),
                ])
              );
        }
      
        public mergeUsing(other: A): void {
          this._state.values[0] = other._state.values[0];
          this._state.values[1] = Array.from(other._state.values[1] as Array<number>);
          this._state.values[2] = Array.from(
            other._state.values[2] as Array<number | null>
          );
          this._state.values[3] = (other._state.values[3] as Array<number> | null) ? Array.from(other._state.values[3] as Array<number>) : null;
          this._state.values[4] = (other._state.values[4] as Array<number | null> | null) ? Array.from(
            other._state.values[4] as Array<number | null> 
          ) : null;
          this._state.values[5] = new Map(
            other._state.values[5] as Map<string, number>
          );
          this._state.values[6] = new Map(
            other._state.values[6] as Map<string, number | null>
          );
          this._state.values[7] = (other._state.values[7] as Map<string, number> | null) ? new Map(
            other._state.values[7] as Map<string, number>
          ) : null;
          this._state.values[8] = (other._state.values[8] as Map<string, number | null> | null) ? new Map(
            other._state.values[8] as Map<string, number | null>
          ) : null;
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
            mapNullField: (this._state.values[7] as Map<string, number> | null) ? Object.fromEntries(
              this._state.values[7] as Map<string, number>
            ) : null,
            maptBothNullField: (this._state.values[8] as Map<string, number | null> | null) ? Object.fromEntries(
              this._state.values[8] as Map<string, number | null>
            ) : null,
          };
        }
      
        public clone(): A {
          return new A({
            stringField: this._state.values[0] as string | null,
            listField: Array.from(this._state.values[1] as Array<number>),
            listValueNullField: Array.from(
              this._state.values[2] as Array<number | null>
            ),
            listNullField: (this._state.values[3] as Array<number> | null) ? Array.from(this._state.values[3] as Array<number>) : null,
            listBothNullField: (this._state.values[4] as Array<number | null> | null) ? Array.from(
              this._state.values[4] as Array<number | null>
            ) : null,
            mapField: new Map(this._state.values[5] as Map<string, number>),
            mapValueNullField: new Map(
              this._state.values[6] as Map<string, number | null>
            ),
            mapNullField: (this._state.values[7] as Map<string, number> | null) ? new Map(
              this._state.values[7] as Map<string, number>
            ) : null,
            maptBothNullField: (this._state.values[8] as Map<string, number | null> | null) ? new Map(
              this._state.values[8] as Map<string, number | null>
            ) : null,
          });
        }
      
        public toString(): string {
          return \`A(stringField: \${this._state.values[0]}, listField: \${this._state.values[1]}, listValueNullField: \${this._state.values[2]}, listNullField: \${this._state.values[3]}, listBothNullField: \${this._state.values[4]}, mapField: \${this._state.values[5]}, mapValueNullField: \${this._state.values[6]}, mapNullField: \${this._state.values[7]}, maptBothNullField: \${this._state.values[8]})\`;
        }
      }`

        const got = formatSource(generator.generate())
        expect(got).toStrictEqual(formatSource(want))
    })

    it('should generate struct with a base type', () => {
        const file = {
            id: '1',
            fileName: 'a.nex',
            path: 'root/a.nex',
            packageName: 'root',
            types: [
                getBaseType({
                    id: '5',
                    name: 'Base',
                    fields: [
                        getField(0, 'varint_field', getPrimitiveValueType('int')),
                        getField(1, 'uvarint_field', getPrimitiveValueType('uint')),
                    ],
                }),
            ],
        } as NexemaFile

        const g = new Generator(
            {
                version: 1,
                hashcode: '',
                files: [file],
            },
            { outputPath: '', useOnlyMaps: true }
        )

        const generator = new StructGenerator(
            getStruct({
                name: 'A',
                fields: [getField(0, 'string_field', getPrimitiveValueType('string'))],
                baseTypeId: '5',
            }),
            file,
            {
                getObject: g.getObject.bind(g),
                resolveFor: g.resolveFor.bind(g),
            }
        )

        const want = `
export class A extends Base<A> implements $nex.NexemaMergeable<A>, $nex.NexemaClonable<A> {
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
        },
        fieldsByJsName: {
          stringField: 0,
        },
      };
    
      public constructor(data: {
        varintField: bigint;
        uvarintField: bigint;
        stringField: string;
      }) {
        super({
          typeInfo: A._typeInfo,
          values: [data.stringField],
          baseValues: [data.varintField, data.uvarintField],
        });
      }

      public static decode(buffer: Uint8Array): A {
        const instance = new A();
        instance.mergeFrom(buffer);
        return instance;
      }
    
      public get stringField(): string {
        return this._state.values[0] as string;
      }
    
      public set stringField(value: string) {
        this._state.values[0] = value;
      }
    
      public override get varintField(): bigint {
        return this._state.baseValues![0] as bigint;
      }
    
      public override set varintField(value: bigint) {
        this._state.baseValues![0] = value;
      }
    
      public override get uvarintField(): bigint {
        return this._state.baseValues![1] as bigint;
      }
    
      public override set uvarintField(value: bigint) {
        this._state.baseValues![1] = value;
      }
    
      public override encode(): Uint8Array {
        const writer = new $nex.NexemabWriter();
        writer.encodeVarint(this._state.baseValues![0] as bigint);
        writer.encodeUvarint(this._state.baseValues![1] as bigint);
        writer.encodeString(this._state.values[0] as string);
        return writer.takeBytes();
      }
    
      public mergeFrom(buffer: Uint8Array): void {
        const reader = new $nex.NexemabReader(buffer);
        this._state.baseValues![0] = reader.decodeVarint();
        this._state.baseValues![1] = reader.decodeUvarint();
        this._state.values[0] = reader.decodeString();
      }
    
      public mergeUsing(other: A): void {
        this._state.baseValues![0] = other._state.baseValues![0];
        this._state.baseValues![1] = other._state.baseValues![1];
        this._state.values[0] = other._state.values[0];
      }
    
      public override toObject(): $nex.JsObj {
        return {
          varintField: this._state.baseValues![0] as bigint,
          uvarintField: this._state.baseValues![1] as bigint,
          stringField: this._state.values[0] as string,
        };
      }
    
      public clone(): A {
        return new A({
          varintField: this._state.baseValues![0] as bigint,
          uvarintField: this._state.baseValues![1] as bigint,
          stringField: this._state.values[0] as string,
        });
      }
    
      public toString(): string {
        return \`A(varintField: \${this._state.baseValues![0]}, uvarintField: \${this._state.baseValues![1]}, stringField: \${this._state.values[0]})\`;
      }
    }`

        const got = formatSource(generator.generate())
        expect(got).toStrictEqual(formatSource(want))
    })

    it('should generate struct with a custom type', () => {
        const file = {
            id: '1',
            fileName: 'a.nex',
            path: 'root/a.nex',
            packageName: 'root',
            types: [
                getStruct({
                    id: '5',
                    name: 'B',
                    fields: [getField(0, 'string_field', getPrimitiveValueType('string'))],
                }),
                getEnum({
                    id: '6',
                    name: 'C',
                    fields: ['unknown', 'red', 'blue'],
                }),
            ],
        } as NexemaFile

        const g = new Generator(
            {
                version: 1,
                hashcode: '',
                files: [file],
            },
            { outputPath: '', useOnlyMaps: true }
        )

        const generator = new StructGenerator(
            getStruct({
                name: 'A',
                fields: [
                    getField(0, 'struct_field', getTypeValueType('5')),
                    getField(1, 'enum_field', getTypeValueType('6')),
                    getField(2, 'null_struct_field', getTypeValueType('5', true)),
                    getField(3, 'null_enum_field', getTypeValueType('6', true)),
                    getField(4, 'list_struct_field', getListValueType(getTypeValueType('5'))),
                    getField(5, 'list_enum_field', getListValueType(getTypeValueType('6'))),
                    getField(
                        6,
                        'map_struct_field',
                        getMapValueType(getPrimitiveValueType('string'), getTypeValueType('5'))
                    ),
                    getField(
                        7,
                        'map_enum_field',
                        getMapValueType(getPrimitiveValueType('string'), getTypeValueType('6'))
                    ),
                    getField(
                        8,
                        'list_struct_null_field',
                        getListValueType(getTypeValueType('5', true))
                    ),
                    getField(
                        9,
                        'list_enum_null_field',
                        getListValueType(getTypeValueType('6', true))
                    ),
                    getField(
                        10,
                        'map_struct_null_field',
                        getMapValueType(
                            getPrimitiveValueType('string'),
                            getTypeValueType('5', true)
                        )
                    ),
                    getField(
                        11,
                        'map_enum_null_field',
                        getMapValueType(
                            getPrimitiveValueType('string'),
                            getTypeValueType('6', true)
                        )
                    ),
                ],
            }),
            file,
            {
                getObject: g.getObject.bind(g),
                resolveFor: g.resolveFor.bind(g),
            }
        )

        const want = `
export class A extends $nex.NexemaStruct<A> implements $nex.NexemaMergeable<A>, $nex.NexemaClonable<A> {
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
            kind: "enum"
          }
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
          data.mapEnumNullField],
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

      writer.encodeBinary((this._state.values[0] as B).encode());
      writer.encodeUint8((this._state.values[1] as C).index);
      if (this._state.values[2] as B | null) {
        writer.encodeBinary((this._state.values[2] as B).encode());
      } else {
        writer.encodeNull();
      }
      if (this._state.values[3] as C | null) {
        writer.encodeUint8((this._state.values[3] as C).index);
      } else {
        writer.encodeNull();
      }
      writer.beginArray((this._state.values[4] as Array<B>).length);
      for (const value of this._state.values[4] as Array<B>) {
        writer.encodeBinary(value.encode());
      }
      writer.beginArray((this._state.values[5] as Array<C>).length);
      for (const value of this._state.values[5] as Array<C>) {
        writer.encodeUint8(value.index);
      }
      writer.beginMap((this._state.values[6] as Map<string, B>).size);
      for (const entry of (this._state.values[6] as Map<string, B>).entries()) {
        writer.encodeString(entry[0]);
        writer.encodeBinary(entry[1].encode());
      }
      writer.beginMap((this._state.values[7] as Map<string, C>).size);
      for (const entry of (this._state.values[7] as Map<string, C>).entries()) {
        writer.encodeString(entry[0]);
        writer.encodeUint8(entry[1].index);
      }
      writer.beginArray((this._state.values[8] as Array<B | null>).length);
      for (const value of this._state.values[8] as Array<B | null>) {
        if (value) {
          writer.encodeBinary((value as B).encode());
        } else {
          writer.encodeNull();
        }
      }
      writer.beginArray((this._state.values[9] as Array<C | null>).length);
      for (const value of (this._state.values[9] as Array<C | null>)) {
        if (value) {
          writer.encodeUint8((value as C).index);
        } else {
          writer.encodeNull();
        }
      }
      writer.beginMap((this._state.values[10] as Map<string, B | null>).size);
      for (const entry of (this._state.values[10] as Map<string, B | null>).entries()) {
        writer.encodeString(entry[0]);
        if (entry[1]) {
          writer.encodeBinary((entry[1] as B).encode());
        } else {
          writer.encodeNull();
        }
      }
      writer.beginMap((this._state.values[11] as Map<string, C | null>).size);
      for (const entry of (this._state.values[11] as Map<string, C | null>).entries()) {
        writer.encodeString(entry[0]);
        if (entry[1]) {
          writer.encodeUint8((entry[1] as C).index);
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
      this._state.values[2] = (other._state.values[2] as B | null)?.clone()
      this._state.values[3] = C.byIndex((other._state.values[3] as C | null)?.index ?? 0)
      this._state.values[4] = Array.from(other._state.values[4] as Array<B>, () => (x as B).clone())
      this._state.values[5] = Array.from(other._state.values[5] as Array<C>, () => C.byIndex((x as C).index))
      this._state.values[6] = new Map(Array.from(other._state.values[6] as Map<string, B>, ([key, value]) => [key, (value as B).clone()]))
      this._state.values[7] = new Map(Array.from(other._state.values[7] as Map<string, C>, ([key, value]) => [key, C.byIndex((value as C).index)]))
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
        listStructField: (this._state.values[4] as Array<B>).map(x => x.toObject()),
        listEnumField: (this._state.values[5] as Array<C>).map(x => x.toObject()),
        mapStructField: Object.fromEntries(Array.from((this._state.values[6]) as Map<string, B>, (entry) => [entry[0], entry[1].toObject()])),
        mapEnumField: Object.fromEntries(Array.from(this._state.values[7] as Map<string, C>, (entry) => [entry[0], entry[1].toObject()])),
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
        listStructField: Array.from(this._state.values[4] as Array<B>, () => (x as B).clone()),
        listEnumField: Array.from(this._state.values[5] as Array<C>, () => C.byIndex((x as C).index)),
        mapStructField: new Map(
          Array.from(this._state.values[6] as Map<string, B>, ([key, value]) => [key, (value as B).clone()])
        ),
        mapEnumField: new Map(
          Array.from(this._state.values[7] as Map<string, C>, ([key, value]) => [key, C.byIndex((value as C).index)])
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
      return \`A(structField: \${this._state.values[0]}, enumField: \${this._state.values[1]}, nullStructField: \${this._state.values[2]}, nullEnumField: \${this._state.values[3]}, listStructField: \${this._state.values[4]}, listEnumField: \${this._state.values[5]}, mapStructField: \${this._state.values[6]}, mapEnumField: \${this._state.values[7]}, listStructNullField: \${this._state.values[8]}, listEnumNullField: \${this._state.values[9]}, mapStructNullField: \${this._state.values[10]}, mapEnumNullField: \${this._state.values[11]})\`;
    }
  }`

        const got = formatSource(generator.generate())
        expect(got).toStrictEqual(formatSource(want))
    })
})
