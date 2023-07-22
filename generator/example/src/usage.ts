import { Address } from './v1/common/location/address.nex'
import { Coordinates } from './v1/common/location/coordinates.nex'
import { AccountDetails, AccountType, AdminAccount, User } from './v1/identity/user.nex'

const user = new User({
    id: '1234',
    createdAt: new Date(),
    email: 'user@mail.com',
    lastName: 'mandatory',
    accountType: AccountType.admin,
    accountDetails: new AccountDetails({
        admin: new AdminAccount({
            fullAccess: true,
        }),
    }),
    address: new Address({
        id: '12344',
        city: 'Buenos Aires',
        region: 'Buenos Aires',
        country: 'Argentina',
        coordinates: new Coordinates({
            latitude: 12,
            longitude: 2,
        }),
    }),
})

const userAsObj = user.toObject()
const userAsJson = user.toJson()
const userAsBinary = user.encode()
const userAsString = user.toString()

console.log('AsObj:', userAsObj)
console.log('AsJson:', userAsJson)
console.log('AsBin:', userAsBinary)
console.log('AsString:', userAsString)
