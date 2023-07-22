/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as $nex from 'nexema'
import * as $entity from './../common/entity.nex'
import * as $user from './user.nex'
import * as $address from './../common/location/address.nex'

export class User
  extends $entity.Entity<User>
  implements $nex.NexemaMergeable<User>, $nex.NexemaClonable<User>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '1018294955515524191',
    name: 'User',
    new: () => User.createEmpty(),
    inherits: {
      name: 'Entity',
    },
    kind: 'struct',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'firstName',
        name: 'first_name',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      1: {
        index: 1,
        jsName: 'lastName',
        name: 'last_name',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      2: {
        index: 2,
        jsName: 'email',
        name: 'email',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
      3: {
        index: 3,
        jsName: 'tags',
        name: 'tags',
        value: {
          kind: 'list',
          nullable: true,
          arguments: [
            {
              kind: 'string',
              nullable: true,
              arguments: [],
            },
          ],
        },
      },
      4: {
        index: 4,
        jsName: 'preferences',
        name: 'preferences',
        value: {
          kind: 'map',
          nullable: false,
          arguments: [
            {
              kind: 'string',
              nullable: false,
              arguments: [],
            },
            {
              kind: 'bool',
              nullable: true,
              arguments: [],
            },
          ],
        },
      },
      5: {
        index: 5,
        jsName: 'accountType',
        name: 'account_type',
        value: {
          kind: 'enum',
          nullable: false,
          typeId: '17814066070050856057',
        },
      },
      6: {
        index: 6,
        jsName: 'accountDetails',
        name: 'account_details',
        value: {
          kind: 'union',
          nullable: false,
          typeId: '10295209963266977739',
        },
      },
      7: {
        index: 7,
        jsName: 'address',
        name: 'address',
        value: {
          kind: 'struct',
          nullable: false,
          typeId: '13009575510080279639',
        },
      },
    },
    fieldsByJsName: {
      firstName: 0,
      lastName: 1,
      email: 2,
      tags: 3,
      preferences: 4,
      accountType: 5,
      accountDetails: 6,
      address: 7,
    },
  }

  public constructor(data: {
    id: string
    createdAt: Date
    deletedAt?: Date | null
    modifiedAt?: Date | null
    firstName?: string
    lastName: string
    email: string
    tags?: Array<string | null> | null
    preferences?: Map<string, boolean | null>
    accountType: $user.AccountType
    accountDetails: $user.AccountDetails
    address: $address.Address
  }) {
    super({
      typeInfo: User._typeInfo,
      values: [
        data.firstName ?? 'Tomas',
        data.lastName,
        data.email,
        data.tags ?? null,
        data.preferences ??
          new Map([
            ['cats', false],
            ['dogs', true],
          ]),
        data.accountType,
        data.accountDetails,
        data.address,
      ],
      baseValues: [
        data.id,
        data.createdAt,
        data.deletedAt ?? null,
        data.modifiedAt ?? null,
      ],
    })
  }

  public static createEmpty(): User {
    return new User({
      id: '',
      createdAt: new Date(0),
      deletedAt: null,
      modifiedAt: null,
      lastName: '',
      email: '',
      tags: null,
      accountType: $user.AccountType.unknown,
      accountDetails: $user.AccountDetails.createEmpty(),
      address: $address.Address.createEmpty(),
    })
  }

  public static decode(buffer: Uint8Array): User {
    const instance = Object.create(User.prototype) as User
    instance._state = {
      values: [null, null, null, null, null, null, null, null],
      baseValues: [null, null, null, null],
      typeInfo: User._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get firstName(): string {
    return this._state.values[0] as string
  }

  public set firstName(value: string) {
    this._state.values[0] = value
  }

  public get lastName(): string {
    return this._state.values[1] as string
  }

  public set lastName(value: string) {
    this._state.values[1] = value
  }

  public get email(): string {
    return this._state.values[2] as string
  }

  public set email(value: string) {
    this._state.values[2] = value
  }
  /**
   * List of tags
   * @deprecated This field is deprecated and should not be used
   */
  public get tags(): Array<string | null> | null {
    return this._state.values[3] as Array<string | null> | null
  }
  /**
   * List of tags
   * @deprecated This field is deprecated and should not be used
   */
  public set tags(value: Array<string | null> | null) {
    this._state.values[3] = value
  }
  /**
   */
  public get preferences(): Map<string, boolean | null> {
    return this._state.values[4] as Map<string, boolean | null>
  }
  /**
   */
  public set preferences(value: Map<string, boolean | null>) {
    this._state.values[4] = value
  }

  public get accountType(): $user.AccountType {
    return this._state.values[5] as $user.AccountType
  }

  public set accountType(value: $user.AccountType) {
    this._state.values[5] = value
  }

  public get accountDetails(): $user.AccountDetails {
    return this._state.values[6] as $user.AccountDetails
  }

  public set accountDetails(value: $user.AccountDetails) {
    this._state.values[6] = value
  }

  public get address(): $address.Address {
    return this._state.values[7] as $address.Address
  }

  public set address(value: $address.Address) {
    this._state.values[7] = value
  }

  public override get id(): string {
    return this._state.baseValues![0] as string
  }

  public override set id(value: string) {
    this._state.baseValues![0] = value
  }

  public override get createdAt(): Date {
    return this._state.baseValues![1] as Date
  }

  public override set createdAt(value: Date) {
    this._state.baseValues![1] = value
  }

  public override get deletedAt(): Date | null {
    return this._state.baseValues![2] as Date | null
  }

  public override set deletedAt(value: Date | null) {
    this._state.baseValues![2] = value
  }

  public override get modifiedAt(): Date | null {
    return this._state.baseValues![3] as Date | null
  }

  public override set modifiedAt(value: Date | null) {
    this._state.baseValues![3] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()
    writer.encodeString(this._state.baseValues![0] as string)
    writer.encodeTimestamp(this._state.baseValues![1] as Date)
    if (this._state.baseValues![2] as Date | null) {
      writer.encodeTimestamp(this._state.baseValues![2] as Date)
    } else {
      writer.encodeNull()
    }
    if (this._state.baseValues![3] as Date | null) {
      writer.encodeTimestamp(this._state.baseValues![3] as Date)
    } else {
      writer.encodeNull()
    }
    writer.encodeString(this._state.values[0] as string)
    writer.encodeString(this._state.values[1] as string)
    writer.encodeString(this._state.values[2] as string)
    if (this._state.values[3] as Array<string | null> | null) {
      writer.beginArray((this._state.values[3] as Array<string | null>).length)
      for (const value of this._state.values[3] as Array<string | null>) {
        if (value) {
          writer.encodeString(value as string)
        } else {
          writer.encodeNull()
        }
      }
    } else {
      writer.encodeNull()
    }
    writer.beginMap((this._state.values[4] as Map<string, boolean | null>).size)
    for (const entry of (
      this._state.values[4] as Map<string, boolean | null>
    ).entries()) {
      writer.encodeString(entry[0])
      if (entry[1]) {
        writer.encodeBool(entry[1] as boolean)
      } else {
        writer.encodeNull()
      }
    }
    writer.encodeUint8((this._state.values[5] as $user.AccountType).index)
    writer.encodeBinary(
      (this._state.values[6] as $user.AccountDetails).encode()
    )
    writer.encodeBinary((this._state.values[7] as $address.Address).encode())
    return writer.takeBytes()
  }

  public override toJson(): string {
    return `{"id":"${
      this.id
    }","created_at":"${this.createdAt.toISOString()}","deleted_at":${
      this.deletedAt ? `"${this.deletedAt.toISOString()}"` : null
    },"modified_at":${
      this.modifiedAt ? `"${this.modifiedAt.toISOString()}"` : null
    },"first_name":"${this.firstName}","last_name":"${
      this.lastName
    }","email":"${this.email}","tags":${
      this.tags
        ? `[${this.tags.map((x) => `${x ? `"${x}"` : null}`).join(',')}]`
        : null
    },"preferences":{${Array.from(
      this.preferences,
      ([key, value]) => `"${key}":${value}`
    ).join(
      ','
    )}},"account_type":${this.accountType.toJson()},"account_details":${this.accountDetails.toJson()},"address":${this.address.toJson()}}`
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.baseValues![0] = reader.decodeString()
    this._state.baseValues![1] = reader.decodeTimestamp()
    this._state.baseValues![2] = reader.isNextNull()
      ? null
      : reader.decodeTimestamp()
    this._state.baseValues![3] = reader.isNextNull()
      ? null
      : reader.decodeTimestamp()
    this._state.values[0] = reader.decodeString()
    this._state.values[1] = reader.decodeString()
    this._state.values[2] = reader.decodeString()
    this._state.values[3] = reader.isNextNull()
      ? null
      : Array.from({ length: reader.beginDecodeArray() }, () =>
          reader.isNextNull() ? null : reader.decodeString()
        )
    this._state.values[4] = new Map(
      Array.from({ length: reader.beginDecodeMap() }, () => [
        reader.decodeString(),
        reader.isNextNull() ? null : reader.decodeBool(),
      ])
    )
    this._state.values[5] =
      $user.AccountType.byIndex(reader.decodeUint8()) ??
      $user.AccountType.unknown
    this._state.values[6] = $user.AccountDetails.decode(reader.decodeBinary())
    this._state.values[7] = $address.Address.decode(reader.decodeBinary())
  }

  public mergeUsing(other: User): void {
    this._state.baseValues![0] = other._state.baseValues![0]
    this._state.baseValues![1] = new Date(other._state.baseValues![1] as Date)
    this._state.baseValues![2] = (other._state.baseValues![2] as Date | null)
      ? new Date(other._state.baseValues![2] as Date)
      : null
    this._state.baseValues![3] = (other._state.baseValues![3] as Date | null)
      ? new Date(other._state.baseValues![3] as Date)
      : null
    this._state.values[0] = other._state.values[0]
    this._state.values[1] = other._state.values[1]
    this._state.values[2] = other._state.values[2]
    this._state.values[3] = (other._state.values[3] as Array<
      string | null
    > | null)
      ? Array.from(other._state.values[3] as Array<string | null>)
      : null
    this._state.values[4] = new Map(
      other._state.values[4] as Map<string, boolean | null>
    )
    this._state.values[5] =
      $user.AccountType.values[
        (other._state.values[5] as $user.AccountType).index
      ]
    this._state.values[6] = (
      other._state.values[6] as $user.AccountDetails
    ).clone()
    this._state.values[7] = (other._state.values[7] as $address.Address).clone()
  }

  public override toObject(): $nex.JsObj {
    return {
      id: this._state.baseValues![0] as string,
      createdAt: this._state.baseValues![1] as Date,
      deletedAt: this._state.baseValues![2] as Date | null,
      modifiedAt: this._state.baseValues![3] as Date | null,
      firstName: this._state.values[0] as string,
      lastName: this._state.values[1] as string,
      email: this._state.values[2] as string,
      tags: (this._state.values[3] as Array<string | null> | null)
        ? Array.from(this._state.values[3] as Array<string | null>)
        : null,
      preferences: Object.fromEntries(
        this._state.values[4] as Map<string, boolean | null>
      ),
      accountType: (this._state.values[5] as $user.AccountType).index,
      accountDetails: (
        this._state.values[6] as $user.AccountDetails
      ).toObject(),
      address: (this._state.values[7] as $address.Address).toObject(),
    }
  }

  public clone(): User {
    return new User({
      id: this._state.baseValues![0] as string,
      createdAt: new Date(this._state.baseValues![1] as Date),
      deletedAt: (this._state.baseValues![2] as Date | null)
        ? new Date(this._state.baseValues![2] as Date)
        : null,
      modifiedAt: (this._state.baseValues![3] as Date | null)
        ? new Date(this._state.baseValues![3] as Date)
        : null,
      firstName: this._state.values[0] as string,
      lastName: this._state.values[1] as string,
      email: this._state.values[2] as string,
      tags: (this._state.values[3] as Array<string | null> | null)
        ? Array.from(this._state.values[3] as Array<string | null>)
        : null,
      preferences: new Map(
        this._state.values[4] as Map<string, boolean | null>
      ),
      accountType:
        $user.AccountType.values[
          (this._state.values[5] as $user.AccountType).index
        ],
      accountDetails: (this._state.values[6] as $user.AccountDetails).clone(),
      address: (this._state.values[7] as $address.Address).clone(),
    })
  }

  public toString(): string {
    return `User(id: ${this._state.baseValues![0]}, createdAt: ${
      this._state.baseValues![1]
    }, deletedAt: ${this._state.baseValues![2]}, modifiedAt: ${
      this._state.baseValues![3]
    }, firstName: ${this._state.values[0]}, lastName: ${
      this._state.values[1]
    }, email: ${this._state.values[2]}, tags: ${
      this._state.values[3]
    }, preferences: ${this._state.values[4]}, accountType: ${
      this._state.values[5]
    }, accountDetails: ${this._state.values[6]}, address: ${
      this._state.values[7]
    })`
  }
}

export class AccountType extends $nex.NexemaEnum<AccountType> {
  private static readonly _enumTypeInfo: $nex.NexemaTypeInfo = {
    typeId: '17814066070050856057',
    inherits: null,
    name: 'AccountType',
    new: () => AccountType.unknown,
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
        jsName: 'admin',
        name: 'admin',
        value: undefined,
      },
      2: {
        index: 2,
        jsName: 'employee',
        name: 'employee',
        value: undefined,
      },
      3: {
        index: 3,
        jsName: 'customer',
        name: 'customer',
        value: undefined,
      },
    },
    fieldsByJsName: {
      unknown: 0,
      admin: 1,
      employee: 2,
      customer: 3,
    },
  }

  protected get _typeInfo(): $nex.NexemaTypeInfo {
    return AccountType._enumTypeInfo
  }

  private constructor(index: number, name: string) {
    super(index, name)
  }

  public static readonly unknown: AccountType = new AccountType(0, 'unknown')

  public static readonly admin: AccountType = new AccountType(1, 'admin')

  public static readonly employee: AccountType = new AccountType(2, 'employee')

  public static readonly customer: AccountType = new AccountType(3, 'customer')

  public static readonly values: ReadonlyArray<AccountType> = Object.freeze([
    AccountType.unknown,
    AccountType.admin,
    AccountType.employee,
    AccountType.customer,
  ])

  public static byIndex(index: number): AccountType | undefined {
    switch (index) {
      case 0:
        return AccountType.unknown
      case 1:
        return AccountType.admin
      case 2:
        return AccountType.employee
      case 3:
        return AccountType.customer
      default:
        return undefined
    }
  }
  public static byName(name: string): AccountType | undefined {
    switch (name) {
      case 'unknown':
        return AccountType.unknown
      case 'admin':
        return AccountType.admin
      case 'employee':
        return AccountType.employee
      case 'customer':
        return AccountType.customer

      default:
        return undefined
    }
  }
}

export class AccountDetails
  extends $nex.NexemaUnion<AccountDetails, 'customer' | 'employee' | 'admin'>
  implements
    $nex.NexemaMergeable<AccountDetails>,
    $nex.NexemaClonable<AccountDetails>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '10295209963266977739',
    name: 'AccountDetails',
    new: () => AccountDetails.createEmpty(),
    inherits: null,
    kind: 'union',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'customer',
        name: 'customer',
        value: {
          kind: 'struct',
          nullable: false,
          typeId: '15573699729907174246',
        },
      },
      1: {
        index: 1,
        jsName: 'employee',
        name: 'employee',
        value: {
          kind: 'struct',
          nullable: false,
          typeId: '2635019918070179479',
        },
      },
      2: {
        index: 2,
        jsName: 'admin',
        name: 'admin',
        value: {
          kind: 'struct',
          nullable: false,
          typeId: '13933365081113129845',
        },
      },
    },
    fieldsByJsName: {
      customer: 0,
      employee: 1,
      admin: 2,
    },
  }

  public constructor(data?: AccountDetailsBuilder) {
    let currentValue: any
    let fieldIndex = -1
    if (data) {
      if (data.customer) {
        currentValue = data.customer
        fieldIndex = 0
      } else if (data.employee) {
        currentValue = data.employee
        fieldIndex = 1
      } else if (data.admin) {
        currentValue = data.admin
        fieldIndex = 2
      }
    }

    super({
      typeInfo: AccountDetails._typeInfo,
      currentValue,
      fieldIndex,
    })
  }

  public static decode(buffer: Uint8Array): AccountDetails {
    const instance = Object.create(AccountDetails.prototype) as AccountDetails
    instance._state = {
      typeInfo: AccountDetails._typeInfo,
      currentValue: undefined,
      fieldIndex: -1,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public static createEmpty(): AccountDetails {
    return new AccountDetails()
  }

  public get customer(): $user.CustomerAccount {
    return this._state.currentValue as $user.CustomerAccount
  }

  public set customer(value: $user.CustomerAccount) {
    this._state.currentValue = value
    this._state.fieldIndex = 0
  }

  public get employee(): $user.EmployeeAccount {
    return this._state.currentValue as $user.EmployeeAccount
  }

  public set employee(value: $user.EmployeeAccount) {
    this._state.currentValue = value
    this._state.fieldIndex = 1
  }

  public get admin(): $user.AdminAccount {
    return this._state.currentValue as $user.AdminAccount
  }

  public set admin(value: $user.AdminAccount) {
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
        writer.encodeBinary(
          (this._state.currentValue as $user.CustomerAccount).encode()
        )
        break
      }
      case 1: {
        writer.encodeVarint(1n)
        writer.encodeBinary(
          (this._state.currentValue as $user.EmployeeAccount).encode()
        )
        break
      }
      case 2: {
        writer.encodeVarint(2n)
        writer.encodeBinary(
          (this._state.currentValue as $user.AdminAccount).encode()
        )
        break
      }
    }
    return writer.takeBytes()
  }

  public override toJson(): string {
    switch (this._state.fieldIndex) {
      case 0: {
        return `${(this._state.currentValue as $user.CustomerAccount).toJson()}`
      }
      case 1: {
        return `${(this._state.currentValue as $user.EmployeeAccount).toJson()}`
      }
      case 2: {
        return `${(this._state.currentValue as $user.AdminAccount).toJson()}`
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
          this._state.currentValue = $user.CustomerAccount.decode(
            reader.decodeBinary()
          )
          this._state.fieldIndex = 0
          break
        }
        case 1n: {
          this._state.currentValue = $user.EmployeeAccount.decode(
            reader.decodeBinary()
          )
          this._state.fieldIndex = 1
          break
        }
        case 2n: {
          this._state.currentValue = $user.AdminAccount.decode(
            reader.decodeBinary()
          )
          this._state.fieldIndex = 2
          break
        }
      }
    }
  }

  public mergeUsing(other: AccountDetails): void {
    this._state.fieldIndex = other._state.fieldIndex
    switch (other._state.fieldIndex) {
      case -1:
        this._state.currentValue = undefined
        break

      case 0:
        this._state.currentValue = (
          other._state.currentValue as $user.CustomerAccount
        ).clone()
        break

      case 1:
        this._state.currentValue = (
          other._state.currentValue as $user.EmployeeAccount
        ).clone()
        break

      case 2:
        this._state.currentValue = (
          other._state.currentValue as $user.AdminAccount
        ).clone()
        break
    }
  }

  public override toObject(): $nex.JsObj {
    switch (this._state.fieldIndex) {
      case 0:
        return (this._state.currentValue as $user.CustomerAccount).toObject()

      case 1:
        return (this._state.currentValue as $user.EmployeeAccount).toObject()

      case 2:
        return (this._state.currentValue as $user.AdminAccount).toObject()

      default:
        return null
    }
  }

  public clone(): AccountDetails {
    const instance = new AccountDetails()
    instance._state.fieldIndex = this._state.fieldIndex
    if (this._state.fieldIndex !== -1) {
      switch (this._state.fieldIndex) {
        case 0:
          instance._state.currentValue = (
            this._state.currentValue as $user.CustomerAccount
          ).clone()
          break

        case 1:
          instance._state.currentValue = (
            this._state.currentValue as $user.EmployeeAccount
          ).clone()
          break

        case 2:
          instance._state.currentValue = (
            this._state.currentValue as $user.AdminAccount
          ).clone()
          break
      }
    }
    return instance
  }

  public toString(): string {
    return `AccountDetails(${this.whichField}: ${this._state.currentValue})`
  }
}

type AccountDetails_customer = {
  customer: $user.CustomerAccount
  employee?: never
  admin?: never
}
type AccountDetails_employee = {
  employee: $user.EmployeeAccount
  customer?: never
  admin?: never
}
type AccountDetails_admin = {
  admin: $user.AdminAccount
  customer?: never
  employee?: never
}
type AccountDetailsBuilder =
  | AccountDetails_customer
  | AccountDetails_employee
  | AccountDetails_admin

export class CustomerAccount
  extends $nex.NexemaStruct<CustomerAccount>
  implements
    $nex.NexemaMergeable<CustomerAccount>,
    $nex.NexemaClonable<CustomerAccount>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '15573699729907174246',
    name: 'CustomerAccount',
    new: () => CustomerAccount.createEmpty(),
    inherits: null,
    kind: 'struct',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'dni',
        name: 'dni',
        value: {
          kind: 'string',
          nullable: false,
          arguments: [],
        },
      },
    },
    fieldsByJsName: {
      dni: 0,
    },
  }

  public constructor(data: { dni: string }) {
    super({
      typeInfo: CustomerAccount._typeInfo,
      values: [data.dni],
      baseValues: undefined,
    })
  }

  public static createEmpty(): CustomerAccount {
    return new CustomerAccount({
      dni: '',
    })
  }

  public static decode(buffer: Uint8Array): CustomerAccount {
    const instance = Object.create(CustomerAccount.prototype) as CustomerAccount
    instance._state = {
      values: [null],
      baseValues: undefined,
      typeInfo: CustomerAccount._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get dni(): string {
    return this._state.values[0] as string
  }

  public set dni(value: string) {
    this._state.values[0] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()

    writer.encodeString(this._state.values[0] as string)
    return writer.takeBytes()
  }

  public override toJson(): string {
    return `{"dni":"${this.dni}"}`
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.values[0] = reader.decodeString()
  }

  public mergeUsing(other: CustomerAccount): void {
    this._state.values[0] = other._state.values[0]
  }

  public override toObject(): $nex.JsObj {
    return {
      dni: this._state.values[0] as string,
    }
  }

  public clone(): CustomerAccount {
    return new CustomerAccount({
      dni: this._state.values[0] as string,
    })
  }

  public toString(): string {
    return `CustomerAccount(dni: ${this._state.values[0]})`
  }
}

export class EmployeeAccount
  extends $nex.NexemaStruct<EmployeeAccount>
  implements
    $nex.NexemaMergeable<EmployeeAccount>,
    $nex.NexemaClonable<EmployeeAccount>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '2635019918070179479',
    name: 'EmployeeAccount',
    new: () => EmployeeAccount.createEmpty(),
    inherits: null,
    kind: 'struct',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'permissions',
        name: 'permissions',
        value: {
          kind: 'list',
          nullable: false,
          arguments: [
            {
              kind: 'string',
              nullable: false,
              arguments: [],
            },
          ],
        },
      },
    },
    fieldsByJsName: {
      permissions: 0,
    },
  }

  public constructor(data: { permissions: Array<string> }) {
    super({
      typeInfo: EmployeeAccount._typeInfo,
      values: [data.permissions],
      baseValues: undefined,
    })
  }

  public static createEmpty(): EmployeeAccount {
    return new EmployeeAccount({
      permissions: [],
    })
  }

  public static decode(buffer: Uint8Array): EmployeeAccount {
    const instance = Object.create(EmployeeAccount.prototype) as EmployeeAccount
    instance._state = {
      values: [null],
      baseValues: undefined,
      typeInfo: EmployeeAccount._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get permissions(): Array<string> {
    return this._state.values[0] as Array<string>
  }

  public set permissions(value: Array<string>) {
    this._state.values[0] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()

    writer.beginArray((this._state.values[0] as Array<string>).length)
    for (const value of this._state.values[0] as Array<string>) {
      writer.encodeString(value)
    }
    return writer.takeBytes()
  }

  public override toJson(): string {
    return `{"permissions":[${this.permissions
      .map((x) => `"${x}"`)
      .join(',')}]}`
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.values[0] = Array.from(
      { length: reader.beginDecodeArray() },
      () => reader.decodeString()
    )
  }

  public mergeUsing(other: EmployeeAccount): void {
    this._state.values[0] = Array.from(other._state.values[0] as Array<string>)
  }

  public override toObject(): $nex.JsObj {
    return {
      permissions: Array.from(this._state.values[0] as Array<string>),
    }
  }

  public clone(): EmployeeAccount {
    return new EmployeeAccount({
      permissions: Array.from(this._state.values[0] as Array<string>),
    })
  }

  public toString(): string {
    return `EmployeeAccount(permissions: ${this._state.values[0]})`
  }
}

export class AdminAccount
  extends $nex.NexemaStruct<AdminAccount>
  implements
    $nex.NexemaMergeable<AdminAccount>,
    $nex.NexemaClonable<AdminAccount>
{
  private static readonly _typeInfo: $nex.NexemaTypeInfo = {
    typeId: '13933365081113129845',
    name: 'AdminAccount',
    new: () => AdminAccount.createEmpty(),
    inherits: null,
    kind: 'struct',
    fieldsByIndex: {
      0: {
        index: 0,
        jsName: 'fullAccess',
        name: 'full_access',
        value: {
          kind: 'bool',
          nullable: false,
          arguments: [],
        },
      },
    },
    fieldsByJsName: {
      fullAccess: 0,
    },
  }

  public constructor(data: { fullAccess: boolean }) {
    super({
      typeInfo: AdminAccount._typeInfo,
      values: [data.fullAccess],
      baseValues: undefined,
    })
  }

  public static createEmpty(): AdminAccount {
    return new AdminAccount({
      fullAccess: false,
    })
  }

  public static decode(buffer: Uint8Array): AdminAccount {
    const instance = Object.create(AdminAccount.prototype) as AdminAccount
    instance._state = {
      values: [null],
      baseValues: undefined,
      typeInfo: AdminAccount._typeInfo,
    }

    instance.mergeFrom(buffer)
    return instance
  }

  public get fullAccess(): boolean {
    return this._state.values[0] as boolean
  }

  public set fullAccess(value: boolean) {
    this._state.values[0] = value
  }

  public override encode(): Uint8Array {
    const writer = new $nex.NexemabWriter()

    writer.encodeBool(this._state.values[0] as boolean)
    return writer.takeBytes()
  }

  public override toJson(): string {
    return `{"full_access":${this.fullAccess}}`
  }

  public mergeFrom(buffer: Uint8Array): void {
    const reader = new $nex.NexemabReader(buffer)
    this._state.values[0] = reader.decodeBool()
  }

  public mergeUsing(other: AdminAccount): void {
    this._state.values[0] = other._state.values[0]
  }

  public override toObject(): $nex.JsObj {
    return {
      fullAccess: this._state.values[0] as boolean,
    }
  }

  public clone(): AdminAccount {
    return new AdminAccount({
      fullAccess: this._state.values[0] as boolean,
    })
  }

  public toString(): string {
    return `AdminAccount(fullAccess: ${this._state.values[0]})`
  }
}
