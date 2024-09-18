import { Client } from '@hubspot/api-client'
import { z } from 'zod'

import { env } from '@/env'
import { getContactByEmail } from '@/services/hubspot/hubspot.ss.services'

import { createTRPCRouter, protectedProcedure } from '../trpc'

const hubspotClient = new Client({ accessToken: env.HUBSPOT_ACCESS_TOKEN })

export const hubspotRouter = createTRPCRouter({
  getContact: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user!

    try {
      const contact = await getContactByEmail(user.email)
      return contact
    } catch (error) {
      const contact = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          email: user.email,
          firstname: user.given_name,
          lastname: user.family_name,
        },
        associations: [],
      })
      return contact
    }
  }),
  updateContact: protectedProcedure
    .input(
      z.object({
        city: z.string(),
        country: z.string(),
        phone: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        zip: z.string(),
        state: z.string(),
        address: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const contact = await getContactByEmail(ctx.session.user.email)
      const res = await hubspotClient.crm.contacts.basicApi.update(contact.id, {
        properties: input,
      })
      return res
    }),
})
