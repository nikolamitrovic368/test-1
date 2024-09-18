import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { client } from '@/config/onesignal'
import { env } from '@/env'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const onesignalRouter = createTRPCRouter({
  sendMailForGift: protectedProcedure
    .input(
      z.object({
        recipientEmail: z.string().email(),
        recipientName: z.string(),
        redemptionLink: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx,
        input: { recipientEmail, redemptionLink, recipientName },
      }) => {
        try {
          const response = await client.createNotification({
            app_id: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
            include_email_tokens: [recipientEmail],
            email_subject: 'Gift For You',
            template_id: '225200a7-2130-41d2-9822-e5b0cc2265c4',
            include_unsubscribed: true,
            custom_data: {
              redemptionLink,
              recipientName,
              senderName: ctx.session.user.name,
            },
          })
          return response
        } catch (error) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message:
              "We can't find this email address. Try again with another mail.",
          })
        }
      },
    ),
  sendMailFornewAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const { email, username, name, given_name, family_name } = ctx.session.user
    await client.createNotification({
      app_id: env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      include_email_tokens: [email],
      email_subject: 'Welcome to Treesury',
      template_id: '443de7d4-adf1-45cb-999d-b66f0a2b0b0d',
      include_unsubscribed: true,
      custom_data: {
        name: username || name || `${given_name} ${family_name}`,
      },
    })
    return { message: 'ok' }
  }),
})
