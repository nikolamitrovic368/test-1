import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { env } from '@/env'
import generateAccessToken from '@/services/paypal/paypal.ss.services'
import {
  confirmAndMintAndFreezeOrder,
  getServiceToken,
} from '@/services/tokeny/servicing.ss.services'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const paypalRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        tokenyOrderId: z.string(),
      }),
    )
    .mutation(async ({ input: { amount, tokenyOrderId } }) => {
      const accessToken = await generateAccessToken()
      const url = `${env.PAYPAL_API_BASE_URL}/v2/checkout/orders`

      const payload = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: tokenyOrderId,
            amount: {
              currency_code: 'EUR',
              value: amount + '',
            },
          },
        ],
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          // Uncomment one of these to force an error for negative testing (in sandbox mode only).
          // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
          // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
          // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
          // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: 'POST',
        body: JSON.stringify(payload),
      })
      try {
        return response.json()
      } catch (err) {
        const errorMessage = await response.text()
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        })
      }
    }),
  captureOrder: protectedProcedure
    .input(
      z.object({
        orderID: z.string(),
      }),
    )
    .mutation(async ({ input: { orderID }, ctx }) => {
      const email = ctx.session.user.email
      const serviceToken = await getServiceToken()

      const accessToken = await generateAccessToken()

      const response = await fetch(
        `${env.PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
          },
        },
      )
      try {
        const orderData = await response.json()
        const errorDetail = orderData?.details?.[0]
        if (!errorDetail) {
          const tokenyOrderId = orderData.purchase_units[0].reference_id
          const transaction = orderData.purchase_units[0].payments.captures[0]
          await confirmAndMintAndFreezeOrder({
            email,
            tokenyOrderId,
            confirmedPaymentAmount: transaction.amount.value,
            accessToken,
            serviceToken,
          })
        }
        return orderData
      } catch (err) {
        const errorMessage = await response.text()
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
        })
      }
    }),
})
