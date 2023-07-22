import { CommonTypes } from '../src/constants'
import { Generator } from '../src/generator'
import { NexemaFile, NexemaPrimitiveValueType } from '../src/models'
import { UnionGenerator } from '../src/union_generator'
import {
    DefaultGenerateContext,
    formatSource,
    getEnum,
    getField,
    getPrimitiveValueType,
    getStruct,
    getTypeValueType,
} from './test_utils'

describe('UnionGenerator', () => {
    it('should generate an union class', () => {
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
                            primitive: 'bool',
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
                id: 'abc',
                packageName: 'root',
                path: 'union.nex',
                types: [],
            },
            DefaultGenerateContext
        )

        const want = `export class MyUnion extends $nex.NexemaUnion<MyUnion, "stringField" | "boolField" | "listField"> implements $nex.NexemaMergeable<MyUnion>, $nex.NexemaClonable<MyUnion> {
    
            private static readonly _typeInfo: $nex.NexemaTypeInfo = {
                typeId: '1',
                name: 'MyUnion',
                new: () => MyUnion.createEmpty(),
                inherits: null,
                kind: "union",
                fieldsByIndex: {
                    0: {
                        index: 0,
                        jsName: "stringField",
                        name: "string_field",
                        value: {
                            kind: "string",
                            nullable: false
                        }
                    },
                    1: {
                        index: 1,
                        jsName: "boolField",
                        name: "bool_field",
                        value: {
                            kind: "bool",
                            nullable: false
                        }
                    },
                    2: {
                        index: 2,
                        jsName: "listField",
                        name: "list_field",
                        value: {
                            kind: "list",
                            nullable: false,
                            arguments: [
                                {
                                    kind: 'float32',
                                    nullable: false
                                }
                            ]
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
                let currentValue: any;
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

            public static decode(buffer: Uint8Array): MyUnion {
              const instance = Object.create(MyUnion.prototype) as MyUnion
              instance._state = {
                typeInfo: MyUnion._typeInfo,
                currentValue: undefined,
                fieldIndex: -1,
              }
            
              instance.mergeFrom(buffer)
              return instance
            }

            public static createEmpty(): MyUnion {
                return new MyUnion()
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
                        writer.encodeVarint(0n)
                        writer.encodeString(this._state.currentValue as string);
                        break;
                    }
                    case 1: {
                        writer.encodeVarint(1n)
                        writer.encodeBool(this._state.currentValue as boolean);
                        break;
                    }
                    case 2: {
                        writer.encodeVarint(2n)
                        writer.beginArray((this._state.currentValue as Array<number>).length);
                        for(const value of this._state.currentValue as Array<number>) {
                            writer.encodeFloat32(value);
                        }
                        break;
                    }
                }
                return writer.takeBytes();
            }

            public override toJson(): string {
              switch (this._state.fieldIndex) {
                case 0: {
                  return \`"\${this._state.currentValue as string}"\`
                }
                case 1: {
                  return \`\${this._state.currentValue as boolean}\`
                }
                case 2: {
                  return \`[\${(this._state.currentValue as Array<number>)
                    .map((x) => \`\${x}\`)
                    .join(',')}]\`
                }
            
                default: {
                  return 'null'
                }
              }
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
    })

    it('should generate an union class with custom types', () => {
        const file = {
            fileName: 'union.nex',
            id: 'abc',
            packageName: 'root',
            path: 'union.nex',
            types: [
                getEnum({
                    id: '50',
                    name: 'A',
                    fields: ['unspecified', 'one', 'two'],
                }),
                getStruct({
                    id: '51',
                    name: 'B',
                    fields: [
                        getField(0, 'a', getPrimitiveValueType('string')),
                        getField(1, 'b', getPrimitiveValueType('float64')),
                    ],
                }),
            ],
        } as NexemaFile

        const g = new Generator(
            {
                hashcode: '',
                version: 0,
                files: [file],
            },
            { outputPath: '', useOnlyMaps: true }
        )
        const generator = new UnionGenerator(
            {
                id: '1',
                name: 'MyUnion',
                fields: [
                    getField(0, 'an_enum', getTypeValueType('50')),
                    getField(1, 'a_struct', getTypeValueType('51')),
                ],
                modifier: 'union',
                baseType: null,
                defaults: null,
                annotations: {},
                documentation: [],
            },
            file,
            {
                getObject: g.getObject.bind(g),
                resolveFor: g.resolveFor.bind(g),
            }
        )

        const want = `export class MyUnion extends $nex.NexemaUnion<MyUnion, "anEnum" | "aStruct"> implements $nex.NexemaMergeable<MyUnion>, $nex.NexemaClonable<MyUnion> {

private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '1',
    name: 'MyUnion',
    new: () => MyUnion.createEmpty(),
    inherits: null,
    kind: "union",
    fieldsByIndex: {
        0: {
            index: 0,
            jsName: "anEnum",
            name: "an_enum",
            value: {
                kind: "enum",
                nullable: false,
                typeId: '50',
            }
        },
        1: {
            index: 1,
            jsName: "aStruct",
            name: "a_struct",
            value: {
                kind: "struct",
                nullable: false,
                typeId: '51',
            }
        }
    },
    fieldsByJsName: {
        anEnum: 0,
        aStruct: 1,
    }
};

public constructor(data?: MyUnionBuilder) {
    let currentValue: any;
    let fieldIndex = -1;
    if(data) {
        if(data.anEnum) {
            currentValue = data.anEnum;
            fieldIndex = 0;
        } else if(data.aStruct) {
            currentValue = data.aStruct;
            fieldIndex = 1;
        }
    }

    super({
        typeInfo: MyUnion._typeInfo,
        currentValue,
        fieldIndex
    });
}

public static decode(buffer: Uint8Array): MyUnion {
  const instance = Object.create(MyUnion.prototype) as MyUnion
  instance._state = {
    typeInfo: MyUnion._typeInfo,
    currentValue: undefined,
    fieldIndex: -1,
  }

  instance.mergeFrom(buffer)
  return instance
}

public static createEmpty(): MyUnion {
  return new MyUnion()
}

public get anEnum(): A {
    return this._state.currentValue as A;
}

public set anEnum(value: A) {
    this._state.currentValue = value;
    this._state.fieldIndex = 0;
}

public get aStruct(): B {
    return this._state.currentValue as B;
}

public set aStruct(value: B) {
    this._state.currentValue = value;
    this._state.fieldIndex = 1;
}

public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter();
    switch(this._state.fieldIndex) {
        case -1: {
            writer.encodeNull();
            break;
        }
        case 0: {
            writer.encodeVarint(0n)
            writer.encodeUint8((this._state.currentValue as A).index);
            break;
        }
        case 1: {
            writer.encodeVarint(1n)
            writer.encodeBinary((this._state.currentValue as B).encode());
            break;
        }
    }
    return writer.takeBytes();
}

public override toJson(): string {
  switch (this._state.fieldIndex) {
    case 0: {
      return \`\${(this._state.currentValue as A).toJson()}\`
    }
    case 1: {
      return \`\${(this._state.currentValue as B).toJson()}\`
    }

    default: {
      return 'null'
    }
  }
}

public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer);
    if(reader.isNextNull()) {
        this.clear();
    } else {
        const field = reader.decodeVarint();
        switch(field) {
            case 0n: {
                this._state.currentValue = A.byIndex(reader.decodeUint8()) ?? A.unspecified
                this._state.fieldIndex = 0;
                break;
            }
            case 1n: {
                this._state.currentValue = B.decode(reader.decodeBinary())
                this._state.fieldIndex = 1;
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
            this._state.currentValue = A.values[(other._state.currentValue as A).index]
            break;

        case 1:
            this._state.currentValue = (other._state.currentValue as B).clone();
            break;
    }
}

public override toObject(): ${CommonTypes.JsObj} {
    switch(this._state.fieldIndex) {
        case 0:
            return (this._state.currentValue as A).index;

        case 1:
            return (this._state.currentValue as B).toObject();

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
                instance._state.currentValue = A.values[(this._state.currentValue as A).index]
                break;

            case 1:
                instance._state.currentValue = (this._state.currentValue as B).clone();
                break;
            
        }
    }
    return instance;
}

public toString(): string {
    return \`MyUnion(\${this.whichField}: \${this._state.currentValue})\`
}
}

type MyUnion_anEnum = {
anEnum: A
aStruct?: never
}
type MyUnion_aStruct = {
aStruct: B
anEnum?: never
}
type MyUnionBuilder = MyUnion_anEnum | MyUnion_aStruct;`

        const got = formatSource(generator.generate(), 'got')
        expect(got).toStrictEqual(formatSource(want, 'want'))
    })
})
