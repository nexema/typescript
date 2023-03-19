/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'
import * as $b from './b.nex'
import * as $c from './foo/c.nex'

export class Foo
  extends $nex.NexemaStruct<Foo>
  implements $nex.NexemaMergeable<Foo>, $nex.NexemaClonable<Foo>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'a',
        name: 'a',
        value: {
          kind: 'string',
        },
      },
      1: {
        index: 1,
        jsName: 'b',
        name: 'b',
        value: {
          kind: 'enum',
        },
      },
      2: {
        index: 2,
        jsName: 'c',
        name: 'c',
        value: {
          kind: 'enum',
        },
      },
      3: {
        index: 3,
        jsName: 'd',
        name: 'd',
        value: {
          kind: 'union',
        },
      },
    },
    fieldsByJsName: {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
    },
  }

  public constructor(data: { a: string; b: Bar; c: $b.Baz; d: $c.Abc }) {
    super({
      typeInfo: Foo._typeInfo,
      values: [data.a, data.b, data.c, data.d],
      baseValues: undefined,
    })
  }

  public static decode(buffer: Uint8Array): Foo {
    const instance = Object.create(Foo.prototype) as Foo
    instance._state = {
      values: [null, null, null, null],
      baseValues: undefined,
      typeInfo: Foo._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get a(): string {
    return this._state.values[0] as string
  }

  public set a(value: string) {
    this._state.values[0] = value
  }

  public get b(): Bar {
    return this._state.values[1] as Bar
  }

  public set b(value: Bar) {
    this._state.values[1] = value
  }

  public get c(): $b.Baz {
    return this._state.values[2] as $b.Baz
  }

  public set c(value: $b.Baz) {
    this._state.values[2] = value
  }

  public get d(): $c.Abc {
    return this._state.values[3] as $c.Abc
  }

  public set d(value: $c.Abc) {
    this._state.values[3] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()

    writer.encodeString(this._state.values[0] as string)
    writer.encodeUint8((this._state.values[1] as Bar).index)
    writer.encodeUint8((this._state.values[2] as $b.Baz).index)
    writer.encodeBinary((this._state.values[3] as $c.Abc).encode())
    return writer.takeBytes()
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.values[0] = reader.decodeString()
    this._state.values[1] = Bar.byIndex(reader.decodeUint8()) ?? Bar.unspecified
    this._state.values[2] =
      $b.Baz.byIndex(reader.decodeUint8()) ?? $b.Baz.unknown
    this._state.values[3] = $c.Abc.decode(reader.decodeBinary())
  }

  public mergeUsing(other: Foo): void {
    this._state.values[0] = other._state.values[0]
    this._state.values[1] = Bar.values[(other._state.values[1] as Bar).index]
    this._state.values[2] =
      $b.Baz.values[(other._state.values[2] as $b.Baz).index]
    this._state.values[3] = (other._state.values[3] as $c.Abc).clone()
  }

  public override toObject(): $nex.JsObj {
    return {
      a: this._state.values[0] as string,
      b: (this._state.values[1] as Bar).index,
      c: (this._state.values[2] as $b.Baz).index,
      d: (this._state.values[3] as $c.Abc).toObject(),
    }
  }

  public clone(): Foo {
    return new Foo({
      a: this._state.values[0] as string,
      b: Bar.values[(this._state.values[1] as Bar).index],
      c: $b.Baz.values[(this._state.values[2] as $b.Baz).index],
      d: (this._state.values[3] as $c.Abc).clone(),
    })
  }

  public toString(): string {
    return `Foo(a: ${this._state.values[0]}, b: ${this._state.values[1]}, c: ${this._state.values[2]}, d: ${this._state.values[3]})`
  }
}

export class Bar extends $nex.NexemaEnum<Bar> {
  private constructor(index: number, name: string) {
    super(index, name)
  }

  public static readonly unspecified: Bar = new Bar(0, 'unspecified')

  public static readonly red: Bar = new Bar(1, 'red')

  public static readonly blue: Bar = new Bar(2, 'blue')

  public static readonly values: ReadonlyArray<Bar> = [
    Bar.unspecified,
    Bar.red,
    Bar.blue,
  ]

  public static byIndex(index: number): Bar | undefined {
    switch (index) {
      case 0:
        return Bar.unspecified
      case 1:
        return Bar.red
      case 2:
        return Bar.blue
      default:
        return undefined
    }
  }
  public static byName(name: string): Bar | undefined {
    switch (name) {
      case 'unspecified':
        return Bar.unspecified
      case 'red':
        return Bar.red
      case 'blue':
        return Bar.blue

      default:
        return undefined
    }
  }
}