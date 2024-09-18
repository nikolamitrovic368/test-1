import { createApi } from '@reduxjs/toolkit/query/react'

import { env } from '@/env'

import axiosBaseQuery from '../axios-base-query'
import type {
  Agreements,
  MainData,
  Qualification,
  SumSubData,
} from './qualification-types'

export const qualificationApi = createApi({
  reducerPath: 'qualificationApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${env.NEXT_PUBLIC_TOKENY_API_BASE_URL}/qualification/api/`,
  }),
  tagTypes: [
    'Qualification',
    'Agreements',
    'MainData',
    'Wallet',
    'Kyc',
    'Sumsub',
  ],
  endpoints: builder => ({
    getQualification: builder.query<Qualification, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}`,
      }),
      providesTags: ['Qualification'],
    }),
    getAgreements: builder.query<Agreements, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/agreements`,
      }),
      providesTags: ['Agreements'],
    }),
    updateAgreements: builder.mutation<void, any>({
      query: data => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/agreements`,
        method: 'post',
        data,
      }),
      invalidatesTags: ['Agreements', 'Qualification'],
    }),
    updateIdentity: builder.mutation<void, any>({
      query: data => ({
        url: `investor`,
        method: 'post',
        data,
      }),
      invalidatesTags: ['Agreements', 'Qualification'],
    }),
    updateDisclaimers: builder.mutation<void, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/disclaimers`,
        method: 'post',
        data: { elements: [] },
      }),
      invalidatesTags: ['Qualification'],
    }),
    getMainData: builder.query<MainData, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/main-data`,
      }),
      transformResponse: (response: MainData) => {
        // https://linear.app/treesury/issue/TRE-57/3-b-institutional-steps#comment-141807a9
        // Manually add hiddenWhen to ubo_politically_exposed
        if (
          response?.elements?.[4]?.fields?.[2].id === 'ubo_politically_exposed'
        )
          response.elements[4].fields[2].hiddenWhen = {
            id: 'ubo_number',
            operator: 'oneOf',
            value: ['0'],
          }
        // https://tree-dev.slack.com/archives/C07B1A47UHK/p1722003206849839?thread_ts=1722003105.020569&cid=C07B1A47UHK
        // remove Referral Name field.
        if (response?.elements?.[5]?.fields?.[0].id === 'source_of_funds')
          response.elements[5].fields[0].options =
            response.elements[5].fields[0].options.filter(v => v.value)
        return response
      },
      providesTags: ['MainData'],
    }),
    updateMainData: builder.mutation<void, any>({
      query: data => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/main-data`,
        method: 'post',
        data,
      }),
      invalidatesTags: ['MainData', 'Qualification'],
    }),
    getWallet: builder.query<any, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/wallet`,
      }),
      providesTags: ['Wallet'],
    }),
    updateWallet: builder.mutation<void, any>({
      query: data => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/wallet`,
        method: 'post',
        data,
      }),
      invalidatesTags: ['Wallet', 'Qualification'],
    }),
    updateDocuments: builder.mutation<void, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/documents`,
        method: 'post',
        data: { elements: [] },
      }),
      invalidatesTags: ['Qualification'],
    }),
    getKyc: builder.query<any, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/kyc`,
      }),
      providesTags: ['Kyc'],
    }),
    updateKyc: builder.mutation<void, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/kyc/update`,
        method: 'post',
        data: {
          status: 'approved',
          kycProviderId: 'SUMSUB',
        },
      }),
      invalidatesTags: ['Kyc', 'Qualification'],
    }),
    getSumsub: builder.query<SumSubData, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/id-check-sumsub`,
      }),
      providesTags: ['Sumsub'],
    }),
    updateSumsub: builder.mutation<void, void>({
      query: () => ({
        url: `qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}/section/id-check-sumsub`,
        method: 'post',
        data: {
          status: 'approved',
          kycProviderId: 'SUMSUB',
        },
      }),
      invalidatesTags: ['Sumsub', 'Qualification'],
    }),
  }),
})

export const {
  useGetQualificationQuery,
  useGetAgreementsQuery,
  useUpdateAgreementsMutation,
  useGetMainDataQuery,
  useUpdateMainDataMutation,
  useUpdateIdentityMutation,
  useUpdateDisclaimersMutation,
  useUpdateWalletMutation,
  useGetWalletQuery,
  useGetKycQuery,
  useUpdateKycMutation,
  useUpdateDocumentsMutation,
  useGetSumsubQuery,
  useUpdateSumsubMutation,
} = qualificationApi
