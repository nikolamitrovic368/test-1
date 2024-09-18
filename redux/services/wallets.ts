import { createApi } from '@reduxjs/toolkit/query/react'

import { env } from '@/env'

import axiosBaseQuery from '../axios-base-query'

export const walletsApi = createApi({
  reducerPath: 'walletsApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${env.NEXT_PUBLIC_TOKENY_API_BASE_URL}/onchainid/v1/api/wallets`,
  }),
  tagTypes: ['Wallets'],
  endpoints: builder => ({
    getWallets: builder.query<Wallets, void>({
      query: () => ({
        url: ``,
      }),
      providesTags: ['Wallets'],
    }),
  }),
})

type Wallet = {
  identityId: string
  walletAddress: string
  externalReference: string
  provider: string
  source: string
  verified: boolean
  signature: string
}

type Wallets = Wallet[]

export const { useGetWalletsQuery } = walletsApi
