import { groq } from 'next-sanity'

export type BankInformation = {
  name: string
  accountName: string
  accountNumber: string
  swift: string
  iban: string
}

export type BanksType = {
  rsdOnly?: BankInformation
  rsd?: BankInformation
  eur?: BankInformation
  usd?: BankInformation
}

export const banksQuery = groq`
*[_type == "bank"][0]
`

export const serbiaBanksQuery = groq`
*[_type == "bank"][0] {
  rsdOnly
}
`

export const nonSerbiaBanksQuery = groq`
*[_type == "bank"][0] {
  rsd,eur,usd
}
`
