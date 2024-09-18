import { TRPCError } from '@trpc/server'
import axios from 'axios'
import { z } from 'zod'

import { env } from '@/env'
import { createSumsubSignature } from '@/services/signatures'
import {
  getCandidate,
  getServiceToken,
} from '@/services/tokeny/servicing.ss.services'

import { createTRPCRouter, protectedProcedure } from '../trpc'

const levelName = 'basic-kyc-level'

export const sumsubRouter = createTRPCRouter({
  createApplicant: protectedProcedure
    .input(
      z.object({
        fixedInfo: z.object({
          firstName: z.string(),
          lastName: z.string(),
          gender: z.enum(['M', 'F']),
          dob: z.string(),
          placeOfBirth: z.string(),
          country: z.string(),
          nationality: z.string(),
          addresses: z
            .object({
              country: z.string(),
              postCode: z.string(),
              street: z.string(),
              state: z.string(),
              // The city, town, or another settlement.
              town: z.string(),
              buildingNumber: z.string(),
            })
            .array(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const serviceToken = await getServiceToken()

        const candidate = (await getCandidate(
          serviceToken,
          ctx.session.user.email,
        ))!

        axios.interceptors.request.use(createSumsubSignature, error =>
          Promise.reject(error),
        )
        const response = await axios({
          method: 'post',
          baseURL: 'https://api.sumsub.com',
          url: `/resources/applicants?levelName=${encodeURIComponent(levelName)}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Token': env.SUMSUB_APP_TOKEN,
          },
          data: JSON.stringify({ ...input, externalUserId: candidate.id }),
        })
        return response.data
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          // optional: pass the original error to retain stack trace
          cause: error,
        })
      }
    }),
  getAccessToken: protectedProcedure.query(async ({ ctx }) => {
    axios.interceptors.request.use(createSumsubSignature, error =>
      Promise.reject(error),
    )
    const serviceToken = await getServiceToken()

    const candidate = (await getCandidate(
      serviceToken,
      ctx.session.user.email,
    ))!

    const { data } = await axios({
      method: 'post',
      baseURL: 'https://api.sumsub.com',
      url: `/resources/accessTokens?userId=${encodeURIComponent(candidate.id)}&ttlInSecs=1200&levelName=${encodeURIComponent(levelName)}`,
      headers: {
        Accept: 'application/json',
        'X-App-Token': env.SUMSUB_APP_TOKEN,
      },
      data: null,
    })
    return data.token as string
  }),
})
