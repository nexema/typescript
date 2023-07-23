import type { BaseNexemaType as $BaseNexemaType } from 'nexema'
import * as $5758910570454447854 from './v1/common/location/address.nex'
import * as $18253202679260610236 from './v1/common/location/coordinates.nex'
import * as $14814708098205083495 from './v1/identity/user.nex'
export const TypeRegistry: Record<string, () => $BaseNexemaType> = {
  'example.com/v1/common/location/Address': () =>
    $5758910570454447854.Address.createEmpty(),
  'example.com/v1/common/location/Coordinates': () =>
    $18253202679260610236.Coordinates.createEmpty(),
  'example.com/v1/identity/User': () =>
    $14814708098205083495.User.createEmpty(),
  'example.com/v1/identity/AccountDetails': () =>
    $14814708098205083495.AccountDetails.createEmpty(),
  'example.com/v1/identity/CustomerAccount': () =>
    $14814708098205083495.CustomerAccount.createEmpty(),
  'example.com/v1/identity/EmployeeAccount': () =>
    $14814708098205083495.EmployeeAccount.createEmpty(),
  'example.com/v1/identity/AdminAccount': () =>
    $14814708098205083495.AdminAccount.createEmpty(),
} as const
