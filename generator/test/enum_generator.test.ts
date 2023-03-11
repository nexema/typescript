import { EnumGenerator } from '../src/enum_generator'
import { formatSource } from './test_utils'

it('should generate enum classes', () => {
    const generator = new EnumGenerator({
        id: '1',
        name: 'MyEnum',
        fields: [
            {
                index: 0,
                name: 'unknown',
                annotations: {},
                documentation: [],
            },
            {
                index: 1,
                name: 'red',
                annotations: {},
                documentation: ['A red color'],
            },
            {
                index: 2,
                name: 'blue',
                annotations: {},
                documentation: ['A blue color'],
            },
        ],
        modifier: 'enum',
        baseType: null,
        annotations: {},
        defaults: {},
        documentation: ['This is the documentation for', 'MyEnum'],
    })

    const want = `
    /**
    * This is the documentation for
    * MyEnum
    */
    export class MyEnum extends $nex.NexemaEnum<MyEnum> {
        private constructor(index: number, name: string) {
            super(index, name);
        }

        public static readonly unknown: MyEnum = new EnumA(0, "unknown");
        
        /**
         * A red color 
         */
        public static readonly red: MyEnum = new EnumA(1, "red");

        /**
         * A blue color 
         */
        public static readonly blue: MyEnum = new EnumA(2, "blue");
    }`

    expect(formatSource(generator.generate())).toStrictEqual(formatSource(want))
})
