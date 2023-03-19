/**
 * The types created here does not represent the actual generated code for TypeScript, they
 * are simplified versions useful for testing only and may not represent the latest generated code.
 */

import { NexemabWriter } from "../src/nexemab/writer";
import { NexemabReader } from "../src/nexemab/reader";
import { JsObj } from "../src/primitives";
import {
  BaseNexemaType,
  NexemaClonable,
  NexemaEnum,
  NexemaMergeable,
  NexemaStruct,
  NexemaUnion,
} from "../src/type";
import { NexemaTypeInfo } from "../src/type_info";

export class EnumA extends NexemaEnum<EnumA> {
  private static readonly _enumTypeInfo: NexemaTypeInfo = {
    kind: "enum",
    fieldsByJsName: {
      unknown: 0,
      red: 1,
      blue: 2,
    },
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "unknown",
        name: "unknown",
      },
      1: {
        index: 1,
        jsName: "red",
        name: "red",
      },
      2: {
        index: 2,
        jsName: "blue",
        name: "blue",
      },
    },
  };

  private constructor(index: number, name: string) {
    super(index, name);
  }

  protected get _typeInfo(): NexemaTypeInfo {
    return EnumA._enumTypeInfo;
  }

  public static readonly unknown: EnumA = new EnumA(0, "unknown");
  public static readonly red: EnumA = new EnumA(1, "red");
  public static readonly blue: EnumA = new EnumA(2, "blue");

  public static readonly values: ReadonlyArray<EnumA> = [
    EnumA.unknown,
    EnumA.red,
    EnumA.blue,
  ];

  public static byIndex(index: number): EnumA | undefined {
    switch (index) {
      case 0:
        return EnumA.unknown;
      case 1:
        return EnumA.red;
      case 2:
        return EnumA.blue;
      default:
        throw "Enum not found.";
    }
  }
}

export class StructA
  extends NexemaStruct<StructA>
  implements NexemaMergeable<StructA>, NexemaClonable<StructA>
{
  public encode(): Uint8Array {
    throw new Error("Method not implemented.");
  }

  public toObject(): JsObj {
    throw new Error("Method not implemented.");
  }

  private static readonly _typeInfo: NexemaTypeInfo = {
    kind: "struct",
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "firstName",
        name: "first_name",
        value: {
          kind: "string",
        },
      },
      1: {
        index: 1,
        jsName: "tags",
        name: "tags",
        value: {
          kind: "list",
          arguments: [
            {
              kind: "string",
            },
          ],
        },
      },
      2: {
        index: 2,
        jsName: "preferences",
        name: "preferences",
        value: {
          kind: "map",
          arguments: [
            {
              kind: "string",
            },
            {
              kind: "boolean",
            },
          ],
        },
      },
      3: {
        index: 3,
        jsName: "enum",
        name: "enum",
        value: {
          kind: "enum",
        },
      },
    },
    fieldsByJsName: {
      firstName: 0,
      tags: 1,
      preferences: 2,
      enum: 3,
    },
  };

  public constructor(
    data: {
      firstName: string;
      tags: Array<string>;
      preferences: Map<string, boolean>;
      enum: EnumA;
    } = {
      firstName: "",
      enum: EnumA.unknown,
      preferences: new Map(),
      tags: [],
    }
  ) {
    super({
      typeInfo: StructA._typeInfo,
      values: [
        "",
        new Array<string>(),
        new Map<string, boolean>(),
        EnumA.unknown,
      ],
    });
  }

  public get firstName(): string {
    return this._state.values[0] as string;
  }

  public set firstName(value: string) {
    this._state.values[0] = value;
  }

  public get tags(): string[] {
    return this._state.values[1] as string[];
  }

  public set tags(value: string[]) {
    this._state.values[1] = value;
  }

  public get preferences(): Map<string, boolean> {
    return this._state.values[2] as Map<string, boolean>;
  }

  public set preferences(value: Map<string, boolean>) {
    this._state.values[2] = value;
  }

  public get enum(): EnumA {
    return this._state.values[3] as EnumA;
  }

  public set enum(value: EnumA) {
    this._state.values[3] = value;
  }

  public mergeUsing(other: StructA): void {
    throw new Error("Method not implemented.");
  }

  public clone(): StructA {
    throw new Error("Method not implemented.");
  }

  public mergeFrom(buffer: Uint8Array): void {
    throw new Error("Method not implemented.");
  }
}

export class UnionA
  extends NexemaUnion<UnionA, "firstName" | "tags" | "preferences" | "enum">
  implements NexemaMergeable<UnionA>, NexemaClonable<UnionA>
{
  public override encode(): Uint8Array {
    const writer = new NexemabWriter();
    return writer.takeBytes();
  }
  public override toObject(): JsObj {
    return {
      firstName: this.firstName,
      tags: this.tags,
      preferences: Object.fromEntries(
        Array.from(this.preferences.entries(), (entry) => [entry[0], entry[1]])
      ),
      enum: this.enum.index,
    };
  }

  private static readonly _typeInfo: NexemaTypeInfo = {
    kind: "union",
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "firstName",
        name: "first_name",
        value: {
          kind: "string",
        },
      },
      1: {
        index: 1,
        jsName: "tags",
        name: "tags",
        value: {
          kind: "list",
          arguments: [
            {
              kind: "string",
            },
          ],
        },
      },
      2: {
        index: 2,
        jsName: "preferences",
        name: "preferences",
        value: {
          kind: "map",
          arguments: [
            {
              kind: "string",
            },
            {
              kind: "boolean",
            },
          ],
        },
      },
      3: {
        index: 3,
        jsName: "enum",
        name: "enum",
        value: {
          kind: "enum",
        },
      },
    },
    fieldsByJsName: {
      firstName: 0,
      tags: 1,
      preferences: 2,
      enum: 3,
    },
  };

  public constructor() {
    super({
      typeInfo: UnionA._typeInfo,
      currentValue: undefined,
      fieldIndex: -1,
    });
  }

  public clone(): UnionA {
    throw new Error("Method not implemented.");
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new NexemabReader(buffer);
    Array.from({ length: reader.beginDecodeArray() }, (x) => 5);
  }

  public get firstName(): string {
    return this._state.currentValue as string;
  }

  public set firstName(value: string) {
    this._state.currentValue = value;
    this._state.fieldIndex = 0;
  }

  public get tags(): string[] {
    return this._state.currentValue as string[];
  }

  public set tags(value: string[]) {
    this._state.currentValue = value;
    this._state.fieldIndex = 1;
  }

  public get preferences(): Map<string, boolean> {
    return this._state.currentValue as Map<string, boolean>;
  }

  public set preferences(value: Map<string, boolean>) {
    this._state.currentValue = value;
    this._state.fieldIndex = 2;
  }

  public get enum(): EnumA {
    return this._state.currentValue as EnumA;
  }

  public set enum(value: EnumA) {
    this._state.currentValue = value;
    this._state.fieldIndex = 3;
  }
}

function main() {
  const blue = EnumA.blue;
  const union: BaseNexemaType = new UnionA();
}
