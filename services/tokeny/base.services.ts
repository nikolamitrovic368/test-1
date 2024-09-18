import axios from 'axios'

import { env } from '@/env'
import { Qualification } from '@/redux/services/qualification-types'
import { client as trpcClient } from '@/trpc/react'

export async function getQualification(tokenyAccessToken: string) {
  const res = await fetch(
    `${env.NEXT_PUBLIC_TOKENY_API_BASE_URL}/qualification/api/qualification/${env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${tokenyAccessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )
  return (await res.json()) as Qualification
}

const getSharedAccount = async (idToken: string) =>
  (
    await axios.get(
      `${env.NEXT_PUBLIC_TOKENY_TRADER_BASE_URL}/shared-accounts/me`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )
  ).data

const createAccount = async (idToken: string) =>
  (
    await axios.post(
      `${env.NEXT_PUBLIC_TOKENY_TRADER_BASE_URL}/accounts`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )
  ).data

export const getTokenyData = async () => {
  const {
    idToken,
    user: { email },
  } = await fetch('/api/auth/token').then(res => res.json())

  let tokenySsoID = ''
  try {
    tokenySsoID = (await getSharedAccount(idToken)).id
  } catch (error: any) {
    if (error?.response?.status === 404) {
      // Send nitification. ref: TRE-113
      await trpcClient.onesignal.sendMailFornewAccount.mutate()
      tokenySsoID = (await createAccount(idToken)).ssoID
    }
  }

  return {
    tokenyAccessToken: (
      await axios.post(
        `${env.NEXT_PUBLIC_TOKENY_TRADER_BASE_URL}/token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )
    ).data.token as string,
    tokenySsoID,
    email: email as string,
  }
}

export const getPortalAccount = async () =>
  (
    await axios.get(
      `${env.NEXT_PUBLIC_TOKENY_API_BASE_URL}/servicing/api/accounts/me`,
    )
  ).data

export const createPortalAccount = async (data: {
  email: string
  ssoID: string
  status: string
}) =>
  (
    await axios.post(
      `${env.NEXT_PUBLIC_TOKENY_API_BASE_URL}/servicing/api/accounts`,
      data,
    )
  ).data
