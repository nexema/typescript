/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'

export class Baz extends $nex.NexemaEnum<Baz> {
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
