/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'
import * as $coordinates from './coordinates.nex'

export class Address
  extends $nex.NexemaStruct<Address>
  implements $nex.NexemaMergeable<Address>, $nex.NexemaClonable<Address>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '13009575510080279639',
    name: 'Address',
    fullName: 'example.com/v1/common/location/Address',
    new: () => Address.createEmpty(),
    inherits: null,
    kind: 'struct',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'id',
        name: 'id',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      1: {
        index: 1,
        jsName: 'city',
        name: 'city',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      2: {
        index: 2,
        jsName: 'region',
        name: 'region',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      3: {
        index: 3,
        jsName: 'country',
        name: 'country',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      4: {
        index: 4,
        jsName: 'coordinates',
        name: 'coordinates',
        value: {
          kind: 'struct',
          nullable: false,
          typeId: '13479800383264607709',
        },
      },
    },
    fieldsByJsName: {
      id: 0,
      city: 1,
      region: 2,
      country: 3,
      coordinates: 4,
    },
  }
  public static override get qualifiedName(): string {
    return this._typeInfo.fullName
  }

  public constructor(data: {
    id: string
    city: string
    region: string
    country: string
    coordinates: $coordinates.Coordinates
  }) {
    super({
      typeInfo: Address._typeInfo,
      values: [data.id, data.city, data.region, data.country, data.coordinates],
      baseValues: undefined,
    })
  }

  public static createEmpty(): Address {
    return new Address({
      id: '',
      city: '',
      region: '',
      country: '',
      coordinates: $coordinates.Coordinates.createEmpty(),
    })
  }

  public static decode(buffer: Uint8Array): Address {
    const instance = Object.create(Address.prototype) as Address
    instance._state = {
      values: [null, null, null, null, null],
      baseValues: undefined,
      typeInfo: Address._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get id(): string {
    return this._state.values[0] as string
  }

  public set id(value: string) {
    this._state.values[0] = value
  }

  public get city(): string {
    return this._state.values[1] as string
  }

  public set city(value: string) {
    this._state.values[1] = value
  }

  public get region(): string {
    return this._state.values[2] as string
  }

  public set region(value: string) {
    this._state.values[2] = value
  }

  public get country(): string {
    return this._state.values[3] as string
  }

  public set country(value: string) {
    this._state.values[3] = value
  }

  public get coordinates(): $coordinates.Coordinates {
    return this._state.values[4] as $coordinates.Coordinates
  }

  public set coordinates(value: $coordinates.Coordinates) {
    this._state.values[4] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()

    writer.encodeString(this._state.values[0] as string)
    writer.encodeString(this._state.values[1] as string)
    writer.encodeString(this._state.values[2] as string)
    writer.encodeString(this._state.values[3] as string)
    writer.encodeBinary(
      (this._state.values[4] as $coordinates.Coordinates).encode()
    )
    return writer.takeBytes()
  }

  public override toJson(): string {
    return `{"id":"${this.id}","city":"${this.city}","region":"${
      this.region
    }","country":"${this.country}","coordinates":${this.coordinates.toJson()}}`
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.values[0] = reader.decodeString()
    this._state.values[1] = reader.decodeString()
    this._state.values[2] = reader.decodeString()
    this._state.values[3] = reader.decodeString()
    this._state.values[4] = $coordinates.Coordinates.decode(
      reader.decodeBinary()
    )
  }

  public mergeUsing(other: Address): void {
    this._state.values[0] = other._state.values[0]
    this._state.values[1] = other._state.values[1]
    this._state.values[2] = other._state.values[2]
    this._state.values[3] = other._state.values[3]
    this._state.values[4] = (
      other._state.values[4] as $coordinates.Coordinates
    ).clone()
  }

  public override toObject(): $nex.JsObj {
    return {
      id: this._state.values[0] as string,
      city: this._state.values[1] as string,
      region: this._state.values[2] as string,
      country: this._state.values[3] as string,
      coordinates: (
        this._state.values[4] as $coordinates.Coordinates
      ).toObject(),
    }
  }

  public clone(): Address {
    return new Address({
      id: this._state.values[0] as string,
      city: this._state.values[1] as string,
      region: this._state.values[2] as string,
      country: this._state.values[3] as string,
      coordinates: (this._state.values[4] as $coordinates.Coordinates).clone(),
    })
  }

  public toString(): string {
    return `Address(id: ${this._state.values[0]}, city: ${this._state.values[1]}, region: ${this._state.values[2]}, country: ${this._state.values[3]}, coordinates: ${this._state.values[4]})`
  }
}
