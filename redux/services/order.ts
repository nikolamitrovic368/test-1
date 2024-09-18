import { createApi } from '@reduxjs/toolkit/query/react'

import { env } from '@/env'
import axiosBaseQuery from '../axios-base-query'
import { OrdersType } from './order-types'

const baseUrl = `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/subscriptions/${env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID}/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/investor-orders`

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: axiosBaseQuery({
    baseUrl: ``,
  }),
  tagTypes: ['Orders'],
  endpoints: builder => ({
    getTokenyOrders: builder.query<OrdersType, number>({
      query: page => ({
        url: `${baseUrl}/me?limit=20&offset=${page * 20}`,
      }),
      providesTags: ['Orders'],
    }),
    getAllTokenyOrders: builder.query<OrdersType, void>({
      query: () => ({
        url: `${baseUrl}/me?limit=1000`,
      }),
      providesTags: ['Orders'],
    }),
    cancelOrder: builder.mutation<any, any>({
      query: orderId => ({
        url: `${baseUrl}/${orderId}/cancel/me`,
        method: 'post',
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  useGetTokenyOrdersQuery,
  useCancelOrderMutation,
  useGetAllTokenyOrdersQuery,
} = orderApi
