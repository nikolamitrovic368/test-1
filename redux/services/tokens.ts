import { createApi } from '@reduxjs/toolkit/query/react'

import axiosBaseQuery from '../axios-base-query'
import { TokensType } from './tokens-types'

export const tokensApi = createApi({
  reducerPath: 'tokensApi',
  baseQuery: axiosBaseQuery({
    baseUrl: '',
  }),
  tagTypes: ['Tokens'],
  endpoints: builder => ({
    getTokens: builder.query<TokensType, void>({
      query: () => ({
        url: `/api/tokens`,
      }),
      providesTags: ['Tokens'],
    }),
  }),
})

export const { useGetTokensQuery } = tokensApi
