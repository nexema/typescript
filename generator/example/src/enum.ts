import * as $nex from 'nexema'; 
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
}
