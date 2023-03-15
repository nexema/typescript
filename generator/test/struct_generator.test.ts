import { CommonTypes } from '../src/constants'
import { NexemaPrimitiveValueType } from '../src/models'
import { StructGenerator } from '../src/struct_generator'
import { formatSource } from './test_utils'

it('should generate struct classes', () => {
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
                        jsKind: "primitive",
                        kind: "string"
                    }
                },
                1: {
                    index: 1,
                    jsName: "boolField",
                    name: "bool_field",
                    value: {
                        jsKind: "primitive",
                        kind: "boolean"
                    }
                },
                2: {
                    index: 2,
                    jsName: "listField",
                    name: "list_field",
                    value: {
                        jsKind: "list",
                        kind: "list"
                    }
                }
            },
            fieldsByName: {
                stringField: 0,
                boolField: 1,
                listField: 2
            }
        };

        public constructor(data: {
            stringField: string,
            boolField: boolean,
            listField: Array<number?>
        } = {
            boolField: true
        }) {
            super({
                typeInfo: MyStruct._typeInfo,
                values: [
                    data.stringField,
                    data.boolField,
                    data.listField
                ]
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

        public get listField(): Array<number?> {
            return this._state.values[2] as Array<number?>;
        }

        public set listField(value: Array<number?>) {
            this._state.values[2] = value;
        }

        public override encode(): Uint8Array {
            const writer = new $nex.NexemabWriter();
            writer.encodeString(stringField);
            writer.encodeBool(boolField);
            writer.beginArray(listField.length);
            for(const value of listField) {
                if(value) {
                    writer.encodeFloat32(value);
                } else {
                    writer.encodeNull();
                }
            }
            return writer.takeBytes();
        }

        public override mergeFrom(buffer: Uint8Array): void {
            const reader = new $nex.NexemabReader(buffer);
            this._state.values[0] = reader.decodeString();
            this._state.values[1] = reader.decodeBool();
            this._state.values[2] = Array.from({length: reader.beginDecodeArray()}, (x) => reader.isNextNull() ? null : reader.decodeFloat32());
        }

        public override toObject(): ${CommonTypes.JsObj} {
            return {
                stringField: this._state.values[0] as string,
                boolField: this._state.values[1] as boolean,
                listField: Array.from(this._state.values[2])
            }
        }

        public override clone(): MyStruct {
            return new MyStruct({
                stringField: this._state.values[0],
                boolField: this._state.values[1],
                listField: Array.from(this._state.values[2])
            });
        }

        public toString(): string {
            return \`MyStruct(stringField: \${this._state.values[0]}, boolField: \${this._state.values[1]}, listField: \${this._state.values[2]})\`
        }
    }`

    expect(formatSource(generator.generate())).toStrictEqual(formatSource(want))
})
