import { EnumGenerator } from '../src/enum_generator'
import { DefaultGenerateContext, formatSource } from './test_utils'

it('should generate enum classes', () => {
    const generator = new EnumGenerator(
        {
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
        },
        {
            id: '',
            fileName: 'enum.nex',
            packageName: 'root',
            path: 'root/enum.nex',
            types: [],
        },
        DefaultGenerateContext
    )

    const want = `
    /**
    * This is the documentation for
    * MyEnum
    */
    export class MyEnum extends $nex.NexemaEnum<MyEnum> {
        private static readonly _enumTypeInfo: $nex.NexemaTypeInfo = {
          typeId: '1',
          inherits: null,
          name: 'MyEnum',
          new: () => MyEnum.unknown,
          kind: 'enum',
          fieldsByIndex: {
            0: {
              index: 0,
              jsName: 'unknown',
              name: 'unknown',
              value: undefined,
            },
            1: {
              index: 1,
              jsName: 'red',
              name: 'red',
              value: undefined,
            },
            2: {
              index: 2,
              jsName: 'blue',
              name: 'blue',
              value: undefined,
            },
          },
          fieldsByJsName: {
            unknown: 0,
            red: 1,
            blue: 2,
          },
        }
        
        protected get _typeInfo(): $nex.NexemaTypeInfo {
          return MyEnum._enumTypeInfo
        }

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
})
