/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'

export class Coordinates
  extends $nex.NexemaStruct<Coordinates>
  implements
    $nex.NexemaMergeable<Coordinates>,
    $nex.NexemaClonable<Coordinates>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '13479800383264607709',
    name: 'Coordinates',
    fullName: 'example.com/v1/common/location/Coordinates',
    new: () => Coordinates.createEmpty(),
    inherits: null,
    kind: 'struct',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'latitude',
        name: 'latitude',
        value: {
          kind: 'float64',
          nullable: false,
          arguments: [],
        },
      },
      1: {
        index: 1,
        jsName: 'longitude',
        name: 'longitude',
        value: {
          kind: 'float64',
          nullable: false,
          arguments: [],
        },
      },
    },
    fieldsByJsName: {
      latitude: 0,
      longitude: 1,
    },
  }
  public static override get qualifiedName(): string {
    return this._typeInfo.fullName
  }

  public constructor(data: { latitude: number; longitude: number }) {
    super({
      typeInfo: Coordinates._typeInfo,
      values: [data.latitude, data.longitude],
      baseValues: undefined,
    })
  }

  public static createEmpty(): Coordinates {
    return new Coordinates({
      latitude: 0,
      longitude: 0,
    })
  }

  public static decode(buffer: Uint8Array): Coordinates {
    const instance = Object.create(Coordinates.prototype) as Coordinates
    instance._state = {
      values: [null, null],
      baseValues: undefined,
      typeInfo: Coordinates._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get latitude(): number {
    return this._state.values[0] as number
  }

  public set latitude(value: number) {
    this._state.values[0] = value
  }

  public get longitude(): number {
    return this._state.values[1] as number
  }

  public set longitude(value: number) {
    this._state.values[1] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()

    writer.encodeFloat64(this._state.values[0] as number)
    writer.encodeFloat64(this._state.values[1] as number)
    return writer.takeBytes()
  }

  public override toJson(): string {
    return `{"latitude":${this.latitude},"longitude":${this.longitude}}`
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.values[0] = reader.decodeFloat64()
    this._state.values[1] = reader.decodeFloat64()
  }

  public mergeUsing(other: Coordinates): void {
    this._state.values[0] = other._state.values[0]
    this._state.values[1] = other._state.values[1]
  }

  public override toObject(): $nex.JsObj {
    return {
      latitude: this._state.values[0] as number,
      longitude: this._state.values[1] as number,
    }
  }

  public clone(): Coordinates {
    return new Coordinates({
      latitude: this._state.values[0] as number,
      longitude: this._state.values[1] as number,
    })
  }

  public toString(): string {
    return `Coordinates(latitude: ${this._state.values[0]}, longitude: ${this._state.values[1]})`
  }
}
