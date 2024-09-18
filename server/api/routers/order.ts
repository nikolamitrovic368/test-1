import { stegaClean } from '@sanity/client/stega'
import { TRPCError } from '@trpc/server'
import crypto from 'crypto'
import Cookies from 'universal-cookie'
import { z } from 'zod'

import { client } from '@/config/onesignal'
import { TOKEN_STORAGE_KEY } from '@/constants/constants'
import {
  fetchNonSerbiaBanksData,
  fetchSerbiaBanksData,
} from '@/sanity/services/documents/bank.service'
import { giftSignature } from '@/services/signatures'
import { getQualification } from '@/services/tokeny/base.services'

import { env } from '@/env'
import { getRates } from '../../../services/rates/rates.services'
import {
  confirmAndMintAndFreezeOrder,
  createOrder,
  getCandidate,
  getCandidates,
  getServiceToken,
  pendingPaymentOrder,
} from '../../../services/tokeny/servicing.ss.services'
import { calculatedTokens } from '../../../utils/utils'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const orderRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ orderIds: z.string().array() }))
    .query(({ ctx, input }) => {
      return ctx.db.order.findMany({
        where: {
          tokenyOrderId: {
            in: input.orderIds,
          },
        },
        relationLoadStrategy: 'join',
        include: {
          order: true,
        },
      })
    }),
  getOrderByTokenyId: protectedProcedure
    .input(
      z.object({
        tokenyOrderId: z.string(),
      }),
    )
    .query(({ ctx, input: { tokenyOrderId } }) => {
      return ctx.db.order.findFirst({
        where: {
          tokenyOrderId,
          email: ctx.session.user.email,
        },
      })
    }),
  getInstallments: protectedProcedure.query(({ ctx }) => {
    return ctx.db.order.findMany({
      where: {
        orderType: 'installments',
        email: ctx.session.user.email,
      },
      include: {
        installmentOrders: true,
      },
      relationLoadStrategy: 'join',
    })
  }),
  getGifts: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: {
        orderType: 'gift',
        email: ctx.session.user.email,
      },
    })

    return orders.map(order => ({
      ...order,
      signature: giftSignature(order.tokenyOrderId!),
    }))
  }),
  create: protectedProcedure
    .input(
      z.object({
        orderType: z.enum([
          'regular',
          'installments',
          'installmentItem',
          'gift',
        ]),
        payType: z.enum(['credit', 'paypal', 'bank']).optional(),
        tokenyOrderId: z.string().optional(),
        country: z.string().optional(),
        reference: z.string().optional(),
        recipientName: z.string().optional(),
        orderId: z.number().optional(),
        orderDate: z.string().optional(),
        tokens: z.number(),
        amount: z.number(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: {
          orderType,
          tokenyOrderId,
          orderId,
          tokens,
          amount,
          payType,
          country,
          reference,
          orderDate,
          recipientName,
        },
      }) => {
        const email = ctx.session.user.email
        if (tokenyOrderId) {
          await client.createNotification({
            app_id: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            include_email_tokens: [email],
            email_subject:
              'Your Treesury Order Has Been Created! Here’s How to Complete Your Payment',
            template_id: '9da6fb83-541e-4286-b8ec-d500fc903399',
            include_unsubscribed: true,
            custom_data: {
              banks: stegaClean(
                country === 'SRB'
                  ? await fetchSerbiaBanksData()
                  : await fetchNonSerbiaBanksData(),
              ),
              reference,
              orderDate,
              tokens,
              amount,
              name: recipientName,
            },
          })
        }
        return ctx.db.order.create({
          data: {
            orderType,
            payType,
            tokenyOrderId,
            orderId,
            tokens,
            amount,
            email,
            ...(orderId
              ? {
                  installmentOrder:
                    (await ctx.db.order.count({
                      where: {
                        orderId,
                      },
                    })) + 1,
                }
              : {}),
          },
        })
      },
    ),
  createTokenyOrder: protectedProcedure
    .input(
      z.object({
        investmentCurrency: z.enum(['EUR']),
        amountToPay: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { investmentCurrency, amountToPay } }) => {
      const serviceToken = await getServiceToken()
      const candidate = await getCandidate(serviceToken, ctx.session.user.email)
      return createOrder(
        { investmentCurrency, amountToPay, identityId: candidate?.id! },
        serviceToken,
      )
    }),
  pendingPaymentOrder: protectedProcedure
    .input(
      z.object({
        tokenyOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { tokenyOrderId } }) => {
      const serviceToken = await getServiceToken()
      const candidate = await getCandidate(serviceToken, ctx.session.user.email)
      return pendingPaymentOrder(
        { tokenyOrderId, identityId: candidate?.id! },
        serviceToken,
      )
    }),
  redeem: protectedProcedure
    .input(
      z.object({
        signature: z.string(),
        tokenyOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { signature, tokenyOrderId } }) => {
      if (signature === giftSignature(tokenyOrderId)) {
        try {
          // const email = ctx.session.user.email
          const [serviceToken, order] = await Promise.all([
            getServiceToken(),
            ctx.db.order.findFirst({
              where: { tokenyOrderId },
              include: { installmentOrders: true },
              relationLoadStrategy: 'join',
            }),
          ])
          const [candidates] = await Promise.all([getCandidates(serviceToken)])
          // const recipient = candidates.find(item => item.email === email)!
          const buyer = candidates.find(item => item.email === order?.email)!
          // unfreeze tokens
          await fetch(
            `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/actions/unfreeze/batch`,
            {
              method: 'post',
              headers: {
                Authorization: `Bearer ${serviceToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                // TODO replace to real ethereum network
                ethereumNetwork: 'AMOY',
                tokenQuantity: calculatedTokens(order?.tokens!).toString(),
                walletAddress: buyer.wallet,
              }),
            },
          )

          // transfer tokens
          await fetch(
            `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/actions/unfreeze/batch`,
            {
              method: 'post',
              headers: {
                Authorization: `Bearer ${serviceToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                // TODO replace to real ethereum network
                ethereumNetwork: 'AMOY',
                tokenQuantity: calculatedTokens(order?.tokens!).toString(),
                walletAddress: buyer.wallet,
              }),
            },
          )

          return { message: 'success' }
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred, please try again later.',
            // optional: pass the original error to retain stack trace
            cause: error,
          })
        }
      } else {
        return { error: 'Signature is not valid' }
      }
    }),
  confirmAndMintAndFreeze: protectedProcedure
    .input(
      z.object({
        ShoppingCartID: z.string(),
        Success: z.string(),
        ApprovalCode: z.string(),
        Signature: z.string(),
        Amount: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { ShoppingCartID, Success, ApprovalCode, Signature, Amount },
      }) => {
        if (
          Signature ===
          crypto
            .createHash('sha512')
            .update(
              `${env.NEXT_PUBLIC_WS_PAY_SHOP_ID}${env.WS_PAY_SECRET_KEY}${ShoppingCartID}${env.WS_PAY_SECRET_KEY}${Success}${env.WS_PAY_SECRET_KEY}${ApprovalCode}${env.WS_PAY_SECRET_KEY}`,
            )
            .digest('hex')
        ) {
          try {
            const email = ctx.session.user.email
            const cookies = new Cookies(ctx.headers.get('cookie'), {
              path: '/',
            })
            const accessToken = cookies.get(TOKEN_STORAGE_KEY)
            const [serviceToken, rate] = await Promise.all([
              getServiceToken(),
              getRates(),
            ])
            await confirmAndMintAndFreezeOrder({
              email,
              tokenyOrderId: ShoppingCartID,
              confirmedPaymentAmount: Math.floor(
                Number(Amount) / rate.EUR,
              ).toString(),
              accessToken,
              serviceToken,
            })
            return { message: 'success' }
          } catch (error) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'An unexpected error occurred, please try again later.',
              // optional: pass the original error to retain stack trace
              cause: error,
            })
          }
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You are trying with wrong information.',
          })
        }
      },
    ),
  getRedemptionLink: protectedProcedure
    .input(
      z.object({
        tokenyOrderId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { tokenyOrderId } }) => {
      const cookies = new Cookies(ctx.headers.get('cookie'), {
        path: '/',
      })
      const accessToken = cookies.get(TOKEN_STORAGE_KEY)
      const qualification = await getQualification(accessToken)

      if (qualification.investorStatus !== 'qualified')
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You must first qualify.',
        })

      const count = await ctx.db.order.count({
        where: {
          tokenyOrderId,
          email: ctx.session.user.email,
        },
      })

      if (count) {
        return giftSignature(tokenyOrderId)
      } else {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: "We can't find order.",
        })
      }
    }),
})
