import { CommonTypes } from '../src/constants'
import { NexemaPrimitiveValueType } from '../src/models'
import { UnionGenerator } from '../src/union_generator'
import { formatSource } from './test_utils'
import fs from 'fs'

it('should generate union classes', () => {
    const generator = new UnionGenerator(
        {
            id: '1',
            name: 'MyUnion',
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
                                nullable: false,
                                primitive: 'float32',
                            } as NexemaPrimitiveValueType,
                        ],
                    } as NexemaPrimitiveValueType,
                    annotations: {},
                    documentation: [],
                },
            ],
            modifier: 'union',
            baseType: null,
            annotations: {},
            defaults: {},
            documentation: [],
        },
        {
            fileName: 'union.nex',
            id: 'abc',
            packageName: 'root',
            path: 'union.nex',
            types: [],
        }
    )

    const want = `export class MyUnion extends $nex.NexemaUnion<MyUnion, "stringField" | "boolField" | "listField"> implements $nex.NexemaMergeable<MyUnion>, $nex.NexemaClonable<MyUnion> {

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

        public constructor(data?: MyUnionBuilder) {
            let currentValue = undefined;
            let fieldIndex = -1;
            if(data) {
                if(data.stringField) {
                    currentValue = data.stringField;
                    fieldIndex = 0;
                } else if(data.boolField) {
                    currentValue = data.boolField;
                    fieldIndex = 1;
                } else if(data.listField) {
                    currentValue = data.listField;
                    fieldIndex = 2;
                }
            }

            super({
                typeInfo: MyUnion._typeInfo,
                currentValue,
                fieldIndex
            });
        }

        public get stringField(): string {
            return this._state.currentValue as string;
        }

        public set stringField(value: string) {
            this._state.currentValue = value;
            this._state.fieldIndex = 0;
        }

        public get boolField(): boolean {
            return this._state.currentValue as boolean;
        }

        public set boolField(value: boolean) {
            this._state.currentValue = value;
            this._state.fieldIndex = 1;
        }

        public get listField(): Array<number> {
            return this._state.currentValue as Array<number>;
        }

        public set listField(value: Array<number>) {
            this._state.currentValue = value;
            this._state.fieldIndex = 2;
        }

        public override encode(): Uint8Array {
            const writer = new $nex.NexemabWriter();
            switch(this._state.fieldIndex) {
                case -1: {
                    writer.encodeNull();
                    break;
                }
                case 0: {
                    writer.encodeString(this._state.currentValue as string);
                    break;
                }
                case 1: {
                    writer.encodeBool(this._state.currentValue as boolean);
                    break;
                }
                case 2: {
                    writer.beginArray((this._state.currentValue as Array<number>).length);
                    for(const value of this._state.currentValue as Array<number>) {
                        writer.encodeFloat32(value);
                    }
                    break;
                }
            }
            return writer.takeBytes();
        }

        public mergeFrom(buffer: Uint8Array): void {
            const reader = new $nex.NexemabReader(buffer);
            if(reader.isNextNull()) {
                this.clear();
            } else {
                const field = reader.decodeVarint();
                switch(field) {
                    case 0n: {
                        this._state.currentValue = reader.decodeString();
                        this._state.fieldIndex = 0;
                        break;
                    }
                    case 1n: {
                        this._state.currentValue = reader.decodeBool();
                        this._state.fieldIndex = 1;
                        break;
                    }
                    case 2n: {
                        this._state.currentValue = Array.from({length: reader.beginDecodeArray()}, () => reader.decodeFloat32());
                        this._state.fieldIndex = 2;
                        break;
                    }
                }
            }
        }

        public mergeUsing(other: MyUnion): void {
            this._state.fieldIndex = other._state.fieldIndex;
            switch(other._state.fieldIndex) {
                case -1:
                    this._state.currentValue = undefined;
                    break;

                case 0:
                case 1:
                    this._state.currentValue = other._state.currentValue;
                    break;
                    
                case 2:
                    this._state.currentValue = Array.from(other._state.currentValue as Array<number>);
                    break;
            }
        }

        public override toObject(): ${CommonTypes.JsObj} {
            switch(this._state.fieldIndex) {
                case 0:
                    return this._state.currentValue as string;

                case 1:
                    return this._state.currentValue as boolean;

                case 2:
                    return Array.from(this._state.currentValue as Array<number>);

                default:
                    return null;
            }
        }

        public clone(): MyUnion {
            const instance = new MyUnion();
            instance._state.fieldIndex = this._state.fieldIndex;
            if(this._state.fieldIndex !== -1) {
                switch(this._state.fieldIndex) {
                    case 0:
                    case 1:
                        instance._state.currentValue = this._state.currentValue;
                        break;

                    case 2: 
                        instance._state.currentValue = Array.from(this._state.currentValue as Array<number>);
                        break;
                    
                }
            }
            return instance;
        }

        public toString(): string {
            return \`MyUnion(\${this.whichField}: \${this._state.currentValue})\`
        }
    }
    
    type MyUnion_stringField = {
        stringField: string;
        boolField?: never;
        listField?: never;
    };
    type MyUnion_boolField = {
        boolField: boolean;
        stringField?: never;
        listField?: never;
    };
    type MyUnion_listField = {
        listField: Array<number>;
        stringField?: never;
        boolField?: never;
    };
    type MyUnionBuilder = MyUnion_stringField | MyUnion_boolField | MyUnion_listField;`

    const got = formatSource(generator.generate())
    expect(got).toStrictEqual(formatSource(want))
    fs.writeFileSync(
        'example/src/union.ts',
        `import * as $nex from 'nexema'; 
    ${got}`
    )
})
