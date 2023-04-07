/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'
import * as $b from './../b.nex'

export class Abc
  extends $nex.NexemaUnion<Abc, 'y' | 'z' | 'w'>
  implements $nex.NexemaMergeable<Abc>, $nex.NexemaClonable<Abc>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '4',
    name: 'Abc',
    new: () => Abc.createEmpty(),
    inherits: null,
    kind: 'union',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'y',
        name: 'y',
        value: {
          kind: 'list',
          nullable: false,
          arguments: [
            {
              kind: 'string',
              nullable: false,
            },
          ],
        },
      },
      1: {
        index: 1,
        jsName: 'z',
        name: 'z',
        value: {
          kind: 'uint64',
          nullable: false,
        },
      },
      2: {
        index: 2,
        jsName: 'w',
        name: 'w',
        value: {
          kind: 'enum',
          nullable: false,
          typeId: '3',
        },
      },
    },
    fieldsByJsName: {
      y: 0,
      z: 1,
      w: 2,
    },
  }

  public constructor(data?: AbcBuilder) {
    let currentValue = undefined
    let fieldIndex = -1
    if (data) {
      if (data.y) {
        currentValue = data.y
        fieldIndex = 0
      } else if (data.z) {
        currentValue = data.z
        fieldIndex = 1
      } else if (data.w) {
        currentValue = data.w
        fieldIndex = 2
      }
    }

    super({
      typeInfo: Abc._typeInfo,
      currentValue,
      fieldIndex,
    })
  }

  public static decode(buffer: Uint8Array): Abc {
    const instance = Object.create(Abc.prototype) as Abc
    instance._state = {
      typeInfo: Abc._typeInfo,
      currentValue: undefined,
      fieldIndex: -1,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public static createEmpty(): Abc {
    return new Abc()
  }

  public get y(): Array<string> {
    return this._state.currentValue as Array<string>
  }

  public set y(value: Array<string>) {
    this._state.currentValue = value
    this._state.fieldIndex = 0
  }

  public get z(): bigint {
    return this._state.currentValue as bigint
  }

  public set z(value: bigint) {
    this._state.currentValue = value
    this._state.fieldIndex = 1
  }

  public get w(): $b.Baz {
    return this._state.currentValue as $b.Baz
  }

  public set w(value: $b.Baz) {
    this._state.currentValue = value
    this._state.fieldIndex = 2
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()
    switch (this._state.fieldIndex) {
      case -1: {
        writer.encodeNull()
        break
      }
      case 0: {
        writer.encodeVarint(0n)
        writer.beginArray((this._state.currentValue as Array<string>).length)
        for (const value of this._state.currentValue as Array<string>) {
          writer.encodeString(value)
        }
        break
      }
      case 1: {
        writer.encodeVarint(1n)
        writer.encodeUint64(this._state.currentValue as bigint)
        break
      }
      case 2: {
        writer.encodeVarint(2n)
        writer.encodeUint8((this._state.currentValue as $b.Baz).index)
        break
      }
    }
    return writer.takeBytes()
  }

  public override toJson(): string {
    switch (this._state.fieldIndex) {
      case 0: {
        return `[${(this._state.currentValue as Array<string>)
          .map((x) => `"${x}"`)
          .join(',')}]`
      }
      case 1: {
        return `"${this._state.currentValue as bigint}"`
      }
      case 2: {
        return `${(this._state.currentValue as $b.Baz).toJson()}`
      }

      default: {
        return 'null'
      }
    }
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    if (reader.isNextNull()) {
      this.clear()
    } else {
      const field = reader.decodeVarint()
      switch (field) {
        case 0n: {
          this._state.currentValue = Array.from(
            { length: reader.beginDecodeArray() },
            () => reader.decodeString()
          )
          this._state.fieldIndex = 0
          break
        }
        case 1n: {
          this._state.currentValue = reader.decodeUint64()
          this._state.fieldIndex = 1
          break
        }
        case 2n: {
          this._state.currentValue =
            $b.Baz.byIndex(reader.decodeUint8()) ?? $b.Baz.unknown
          this._state.fieldIndex = 2
          break
        }
      }
    }
  }

  public mergeUsing(other: Abc): void {
    this._state.fieldIndex = other._state.fieldIndex
    switch (other._state.fieldIndex) {
      case -1:
        this._state.currentValue = undefined
        break

      case 1:
        this._state.currentValue = other._state.currentValue
        break

      case 0:
        this._state.currentValue = Array.from(
          other._state.currentValue as Array<string>
        )
        break

      case 2:
        this._state.currentValue =
          $b.Baz.values[(other._state.currentValue as $b.Baz).index]
        break
    }
  }

  public override toObject(): $nex.JsObj {
    switch (this._state.fieldIndex) {
      case 0:
        return Array.from(this._state.currentValue as Array<string>)

      case 1:
        return this._state.currentValue as bigint

      case 2:
        return (this._state.currentValue as $b.Baz).index

      default:
        return null
    }
  }

  public clone(): Abc {
    const instance = new Abc()
    instance._state.fieldIndex = this._state.fieldIndex
    if (this._state.fieldIndex !== -1) {
      switch (this._state.fieldIndex) {
        case 1:
          instance._state.currentValue = this._state.currentValue
          break

        case 0:
          instance._state.currentValue = Array.from(
            this._state.currentValue as Array<string>
          )
          break

        case 2:
          instance._state.currentValue =
            $b.Baz.values[(this._state.currentValue as $b.Baz).index]
          break
      }
    }
    return instance
  }

  public toString(): string {
    return `Abc(${this.whichField}: ${this._state.currentValue})`
  }
}

type Abc_y = {
  y: Array<string>
  z?: never
  w?: never
}
type Abc_z = {
  z: bigint
  y?: never
  w?: never
}
type Abc_w = {
  w: $b.Baz
  y?: never
  z?: never
}
type AbcBuilder = Abc_y | Abc_z | Abc_w
