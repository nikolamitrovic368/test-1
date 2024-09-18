import { createApi } from '@reduxjs/toolkit/query/react'

import axiosBaseQuery from '../axios-base-query'
import { HolderType } from './holders-types'

export const holdersApi = createApi({
  reducerPath: 'holdersApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `https://api-testing.tokeny.com/servicing/api/holders`,
  }),
  tagTypes: ['Holder'],
  endpoints: builder => ({
    getHolder: builder.query<HolderType, void>({
      query: () => ({
        url: `/me`,
      }),
      providesTags: ['Holder'],
    }),
    updateHolder: builder.mutation<void, any>({
      query: data => ({
        url: `/me`,
        method: 'patch',
        data,
      }),
      invalidatesTags: ['Holder'],
    }),
  }),
})

export const { useGetHolderQuery, useUpdateHolderMutation } = holdersApi
