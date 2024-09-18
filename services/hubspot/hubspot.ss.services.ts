import { Client } from '@hubspot/api-client'

import { env } from '@/env'

const BASE_OBJECT_URL = 'https://api.hubapi.com/crm/v3/objects'

const hubspotClient = new Client({ accessToken: env.HUBSPOT_ACCESS_TOKEN })

export function getContactByEmail(email: string) {
  return hubspotClient.crm.contacts.basicApi.getById(
    email,
    undefined,
    undefined,
    undefined,
    false,
    'email',
  )
}

export async function createDeal(properties: any) {
  const response = await fetch(`${BASE_OBJECT_URL}/deals`, {
    method: 'post',
    headers: {
      Authorization: `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties }),
  })
  return await response.json()
}

export async function associateContactToDeal(
  dealId: string,
  contactId: string,
) {
  const response = await fetch(
    `${BASE_OBJECT_URL}/deals/${dealId}/associations/contacts/${contactId}/3`,
    {
      method: 'put',
      headers: {
        Authorization: `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
      },
    },
  )
  return await response.json()
}
