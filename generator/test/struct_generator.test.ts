import fs from 'fs'
import { CommonTypes } from '../src/constants'
import { NexemaPrimitiveValueType } from '../src/models'
import { StructGenerator } from '../src/struct_generator'
import {
    formatSource,
    getField,
    getListValueType,
    getMapValueType,
    getPrimitiveValueType,
    getStruct,
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
            }
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

                writer.encodeString(this.stringField);
                writer.encodeBool(this.boolField);
                writer.beginArray(this.listField.length);
                for(const value of this.listField) {
                    if(value) {
                        writer.encodeFloat32(value);
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
                this._state.values[0] = other._state.values[0] as string
                this._state.values[1] = other._state.values[1] as boolean
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
        fs.writeFileSync(
            'example/src/struct.ts',
            `import * as $nex from 'nexema'; 
        ${got}`
        )
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
            }
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
    
        writer.encodeString(this.stringField);
        writer.encodeBool(this.boolField);
        writer.encodeVarint(this.intField);
        writer.encodeInt8(this.int8Field);
        writer.encodeInt16(this.int16Field);
        writer.encodeInt32(this.int32Field);
        writer.encodeInt64(this.int64Field);
        writer.encodeUvarint(this.uintField);
        writer.encodeUint8(this.uint8Field);
        writer.encodeUint16(this.uint16Field);
        writer.encodeUint32(this.uint32Field);
        writer.encodeUint64(this.uint64Field);
        writer.encodeFloat32(this.float32Field);
        writer.encodeFloat64(this.float64Field);
        writer.encodeBinary(this.binaryField);
        writer.encodeTimestamp(this.timestampField);
        writer.encodeDuration(this.durationField);
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
        this._state.values[0] = other._state.values[0] as string;
        this._state.values[1] = other._state.values[1] as boolean;
        this._state.values[2] = other._state.values[2] as bigint;
        this._state.values[3] = other._state.values[3] as number;
        this._state.values[4] = other._state.values[4] as number;
        this._state.values[5] = other._state.values[5] as number;
        this._state.values[6] = other._state.values[6] as bigint;
        this._state.values[7] = other._state.values[7] as bigint;
        this._state.values[8] = other._state.values[8] as number;
        this._state.values[9] = other._state.values[9] as number;
        this._state.values[10] = other._state.values[10] as number;
        this._state.values[11] = other._state.values[11] as bigint;
        this._state.values[12] = other._state.values[12] as number;
        this._state.values[13] = other._state.values[13] as number;
        this._state.values[14] = new Uint8Array(
          other._state.values[14] as Uint8Array
        );
        this._state.values[15] = new Date(other._state.values[15] as Date);
        this._state.values[16] = other._state.values[16] as bigint;
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
            }
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
        fs.writeFileSync(
            'example/src/test.ts',
            `
        import * as $nex from 'nexema';
        ${got}`
        )
        expect(got).toStrictEqual(formatSource(want))
    })
})
