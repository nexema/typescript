/**
 * The types created here does not represent the actual generated code for TypeScript, they
 * are simplified versions useful for testing only and may not represent the latest generated code.
 */

import { NexemabWriter } from "../src/nexemab/writer";
import { JsObj } from "../src/primitives";
import {
  Clonable,
  NexemaEnum,
  NexemaMergeable,
  NexemaStruct,
  NexemaUnion,
} from "../src/type";
import { NexemaTypeInfo } from "../src/type_info";

export class EnumA extends NexemaEnum<EnumA> {
  private constructor(index: number, name: string) {
    super(index, name);
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
  implements NexemaMergeable<StructA>, Clonable<StructA>
{
  public encode(): Uint8Array {
    throw new Error("Method not implemented.");
  }

  public toObject(): JsObj {
    throw new Error("Method not implemented.");
  }

  private static readonly _typeInfo: NexemaTypeInfo = {
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "firstName",
        name: "first_name",
        value: {
          jsKind: "primitive",
          kind: "string",
        },
      },
      1: {
        index: 1,
        jsName: "tags",
        name: "tags",
        value: {
          jsKind: "list",
          kind: "list",
          arguments: [
            {
              jsKind: "primitive",
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
          jsKind: "map",
          kind: "map",
          arguments: [
            {
              jsKind: "primitive",
              kind: "string",
            },
            {
              jsKind: "primitive",
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
          jsKind: "type",
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

export class UnionA extends NexemaUnion<
  UnionA,
  "firstName" | "tags" | "preferences" | "enum"
> {
  public override encode(): Uint8Array {
    const writer = new NexemabWriter();
    return writer.takeBytes();
  }
  public override toObject(): JsObj {
    throw new Error("Method not implemented.");
  }

  private static readonly _typeInfo: NexemaTypeInfo = {
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: "firstName",
        name: "first_name",
        value: {
          jsKind: "primitive",
          kind: "string",
        },
      },
      1: {
        index: 1,
        jsName: "tags",
        name: "tags",
        value: {
          jsKind: "list",
          kind: "list",
          arguments: [
            {
              jsKind: "primitive",
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
          jsKind: "map",
          kind: "map",
          arguments: [
            {
              jsKind: "primitive",
              kind: "string",
            },
            {
              jsKind: "primitive",
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
          jsKind: "type",
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
