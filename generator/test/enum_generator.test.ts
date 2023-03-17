import { EnumGenerator } from '../src/enum_generator'
import { formatSource } from './test_utils'
import fs from 'fs'

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

        public static readonly unknown: MyEnum = new MyEnum(0, "unknown");
        
        /**
         * A red color 
         */
        public static readonly red: MyEnum = new MyEnum(1, "red");

        /**
         * A blue color 
         */
        public static readonly blue: MyEnum = new MyEnum(2, "blue");

        public static readonly values: ReadonlyArray<MyEnum> = [
            MyEnum.unknown,
            MyEnum.red,
            MyEnum.blue,
        ];

           public static byIndex(index: number): MyEnum | undefined {
             switch (index) {
               case 0:
                return MyEnum.unknown;
               case 1:
                return MyEnum.red;
               case 2:
                return MyEnum.blue;
               default:
                return undefined;
             }
           }
           public static byName(name: string): MyEnum | undefined {
             switch (name) {
               case "unknown":
                return MyEnum.unknown;
               case "red":
                return MyEnum.red;
               case "blue":
                return MyEnum.blue;
           
               default:
                return undefined;
             }
           } 
    }`

    const got = formatSource(generator.generate())
    expect(got).toStrictEqual(formatSource(want))
    fs.writeFileSync(
        'example/src/enum.ts',
        `import * as $nex from 'nexema'; 
    ${got}`
    )
})
