/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'

export class Baz extends $nex.NexemaEnum<Baz> {
  private static readonly _enumTypeInfo: $nex.NexemaTypeInfo = {
    typeId: '3',
    inherits: null,
    name: 'Baz',
    new: () => Baz.unknown,
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
        jsName: 'one',
        name: 'one',
        value: undefined,
      },
      2: {
        index: 2,
        jsName: 'two',
        name: 'two',
        value: undefined,
      },
    },
    fieldsByJsName: {
      unknown: 0,
      one: 1,
      two: 2,
    },
  }

  protected get _typeInfo(): $nex.NexemaTypeInfo {
    return Baz._enumTypeInfo
  }

  private constructor(index: number, name: string) {
    super(index, name)
  }

  public static readonly unknown: Baz = new Baz(0, 'unknown')

  public static readonly one: Baz = new Baz(1, 'one')

  public static readonly two: Baz = new Baz(2, 'two')

  public static readonly values: ReadonlyArray<Baz> = [
    Baz.unknown,
    Baz.one,
    Baz.two,
  ]

  public static byIndex(index: number): Baz | undefined {
    switch (index) {
      case 0:
        return Baz.unknown
      case 1:
        return Baz.one
      case 2:
        return Baz.two
      default:
        return undefined
    }
  }
  public static byName(name: string): Baz | undefined {
    switch (name) {
      case 'unknown':
        return Baz.unknown
      case 'one':
        return Baz.one
      case 'two':
        return Baz.two

      default:
        return undefined
    }
  }
}
