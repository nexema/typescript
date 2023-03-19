import { BaseTypeGenerator } from '../src/base_type_generator'
import { NexemaPrimitiveValueType } from '../src/models'
import { formatSource } from './test_utils'

it('should generate base type classes', () => {
    const generator = new BaseTypeGenerator(
        {
            id: '1',
            name: 'MyBase',
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
            modifier: 'base',
            baseType: null,
            annotations: {},
            defaults: {},
            documentation: [],
        },
        {
            fileName: 'base.nex',
            id: 'abc',
            packageName: 'root',
            path: 'base.nex',
            types: [],
        }
    )

    const want = `export abstract class MyBase<T extends $nex.NexemaStruct<T>> extends $nex.NexemaStruct<MyBase<T>> {
        public abstract get stringField(): string;

        public abstract set stringField(value: string);

        public abstract get boolField(): boolean;

        public abstract set boolField(value: boolean);

        public abstract get listField(): Array<number | null>;

        public abstract set listField(value: Array<number | null>);
    }`

    const got = formatSource(generator.generate())
    expect(got).toStrictEqual(formatSource(want))
})
