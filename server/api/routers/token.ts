import { env } from '@/env'
import { getServiceToken } from '@/services/tokeny/servicing.ss.services'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const tokenRouter = createTRPCRouter({
  getTokens: protectedProcedure.query(async ({ ctx }) => {
    const accessToken = ctx.headers.get('authorization')!

    const NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL =
      env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL

    const serviceToken = await getServiceToken()
    const tokens = await fetch(
      `${NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens`,
      {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      },
    ).then(res => res.json())
    const detailedTokens: {
      id: string
      name: string
      type: string
      balance: string
      frozenBalance: string
    }[] = await Promise.all(
      tokens.map(async (token: any) => {
        const holder = await fetch(
          `${NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${token.id}/holders/me`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        ).then(res => res.json())

        const detailedHolder = await fetch(
          `${NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${token.id}/holders/${holder.id}`,
          {
            headers: {
              Authorization: `Bearer ${serviceToken}`,
            },
          },
        ).then(res => res.json())
        return {
          id: token.id,
          name: token.name,
          type: token.type,
          balance: detailedHolder.balance,
          frozenBalance: detailedHolder.frozenBalance,
        }
      }),
    )
    return detailedTokens
  }),
})
