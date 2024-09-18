import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { type ExchangeRate } from '../../services/rates/rates.services'

export const exchangeRateApi = createApi({
  reducerPath: 'exchangeRateApi',
  baseQuery: fetchBaseQuery(),
  tagTypes: ['ExchangeRate'],
  endpoints: builder => ({
    getRates: builder.query<ExchangeRate, void>({
      query: () => '/api/rate',
    }),
  }),
})

export const { useGetRatesQuery } = exchangeRateApi
