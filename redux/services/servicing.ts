import { createApi } from '@reduxjs/toolkit/query/react'

import { env } from '@/env'
import axiosBaseQuery from '../axios-base-query'

export const servicingApi = createApi({
  reducerPath: 'servicingApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${env.NEXT_PUBLIC_TOKENY_API_BASE_URL}/servicing/api/subscriptions/`,
  }),
  tagTypes: ['SubscriptionData'],
  endpoints: builder => ({
    getSubscription: builder.query<any, void>({
      query: () => ({
        url: `tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/me`,
      }),
      providesTags: ['SubscriptionData'],
    }),
  }),
})

export const { useGetSubscriptionQuery } = servicingApi
