export type HolderType = {
  id: string
  typeOfInvestor: string
  identityId: string
  investor: string
  email: string
  updatedAt: string
  networks: [
    {
      network: string
      identityId: string
      identityAddress: string
      identityRegistryStorage: string
      status: string
      wallet: string
      provider: string
    },
  ]
  identityAddress: string
  walletsAndStatus: [
    {
      provider: string
      status: string
      wallet: string
      identityRegistryStorage: string
    },
  ]
  individual: {
    birthday: string
    birthplace: string
    firstName: string
    gender: string
    idNumber: string
    lastName: string
    nationality: string
    occupation: string
    passportNumber: string
    phone: string
    politicallyExposed: boolean
    buildingNumber: string
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  institutional: string
}
