import { OrderItemType } from '@/redux/services/order-types'
import { db } from '@/server/db'

import { env } from '@/env'
import { getRates } from '../rates/rates.services'

type Candidates = {
  email: string
  id: string
  kycProvider: string
  kycStatus: string
  lastLogin: string
  createdAt: string
  name: string
  currentSection: string
  status: string
  investorType: string
  country: string
  wallet: string
  walletProvider: string
}[]

export const getServiceToken = () =>
  fetch(`${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/auth/signin`, {
    body: JSON.stringify({
      email: env.TOKENY_SERVICE_API_EMAIL,
      password: env.TOKENY_SERVICE_API_PASSWORD,
    }),
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => res.token as string)

export async function getCandidate(serviceToken: string, email: string) {
  const data = await getCandidates(serviceToken)
  return data.find((item: any) => item.email === email)
}

export async function getCandidates(serviceToken: string) {
  const data = await (
    await fetch(
      `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/candidates`,
      {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      },
    )
  ).json()
  return data.items as Candidates
}

export async function createOrder(
  orderData: {
    investmentCurrency: 'EUR'
    amountToPay: string
    identityId: string
  },
  serviceToken: string,
): Promise<OrderItemType> {
  const res = await fetch(
    `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/subscriptions/${env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID}/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/investor-orders`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    },
  )
  return res.json()
}

export async function pendingPaymentOrder(
  {
    tokenyOrderId,
    identityId,
  }: {
    tokenyOrderId: string
    identityId: string
  },
  serviceToken: string,
) {
  await fetch(
    `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/subscriptions/${env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID}/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/investor-orders/${tokenyOrderId}/pending-payment`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identityId }),
    },
  )
}

export async function confirmAndMintAndFreezeOrder({
  email,
  tokenyOrderId,
  confirmedPaymentAmount,
  accessToken,
  serviceToken,
}: {
  email: string
  tokenyOrderId: string
  confirmedPaymentAmount: string
  accessToken: string
  serviceToken: string
}) {
  console.log({
    email,
    tokenyOrderId,
    confirmedPaymentAmount,
    accessToken,
    serviceToken,
  })

  const [order] = await Promise.all([
    db.order.findFirst({
      where: {
        tokenyOrderId,
      },
      include: {
        installmentOrders: true,
      },
      relationLoadStrategy: 'join',
    }),
    getRates(),
  ])

  await fetch(
    `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/subscriptions/${env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID}/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/investor-orders/${tokenyOrderId}/confirm`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confirmedPaymentAmount,
        exchangeRateType: 'AT_PAYMENT',
        exchangeRate: 1,
      }),
    },
  )
  // TODO TRE-149 Disable auto-mint on paypal payment (temporary) for everyone - just make sure it is paid and confirmed, not MINTED (do not mint via tokeny) - we will need this later!
  // await fetch(
  //   `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/subscriptions/${env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID}/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/investor-orders/mint`,
  //   {
  //     method: 'post',
  //     headers: {
  //       Authorization: `Bearer ${serviceToken}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ orderIds: [tokenyOrderId] }),
  //   },
  // )
  // const candidate = (await getCandidate(serviceToken, email))!
  if (order?.orderType === 'gift') {
    // TODO TRE-149 Disable auto-mint on paypal payment (temporary) for everyone - just make sure it is paid and confirmed, not MINTED (do not mint via tokeny) - we will need this later!
    // await fetch(
    //   `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/actions/freeze`,
    //   {
    //     method: 'post',
    //     headers: {
    //       Authorization: `Bearer ${serviceToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       // TODO replace to real ethereum network
    //       ethereumNetwork: 'AMOY',
    //       tokenQuantity: calculatedTokens(order?.tokens!).toString(),
    //       walletAddress: candidate.wallet,
    //     }),
    //   },
    // )
  } else {
    // TODO TRE-149 Disable auto-mint on paypal payment (temporary) for everyone - just make sure it is paid and confirmed, not MINTED (do not mint via tokeny) - we will need this later!
    // await fetch(
    //   `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/actions/mint`,
    //   {
    //     method: 'post',
    //     headers: {
    //       Authorization: `Bearer ${serviceToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       // TODO replace to real ethereum network
    //       ethereumNetwork: 'AMOY',
    //       tokenQuantity: bonusToken(order?.tokens!).toString(),
    //       walletAddress: candidate.wallet,
    //     }),
    //   },
    // )

    if (order?.orderType === 'installmentItem') {
      // const [tokenyOrders, installmentOrder] = await Promise.all([
      //   (
      //     await axios.get(
      //       `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/subscriptions/${env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID}/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/investor-orders/me`,
      //       {
      //         params: {
      //           limit: 1000,
      //         },
      //         headers: {
      //           Authorization: `Bearer ${accessToken}`,
      //         },
      //       },
      //     )
      //   ).data as OrdersType,
      //   db.order.findUnique({
      //     where: {
      //       id: order?.orderId!,
      //       email,
      //     },
      //     include: {
      //       installmentOrders: true,
      //     },
      //     relationLoadStrategy: 'join',
      //   }),
      // ])
      // TODO TRE-149 Disable auto-mint on paypal payment (temporary) for everyone - just make sure it is paid and confirmed, not MINTED (do not mint via tokeny) - we will need this later!
      // const confirmedInstallmentTokens =
      //   installmentOrder!.installmentOrders.reduce(
      //     (confirmed, installmentOrder) => {
      //       const tokenyOrder = tokenyOrders.items.find(
      //         tokenyOrder => tokenyOrder.id === installmentOrder.tokenyOrderId,
      //       )
      //       return tokenyOrder?.status === 'MINTED' ||
      //         tokenyOrder?.status === 'MINT_IN_PROGRESS'
      //         ? confirmed +
      //             calculatedTokens(Number(tokenyOrder.tokensAtPayment))
      //         : confirmed
      //     },
      //     0,
      //   )
      // if (
      //   confirmedInstallmentTokens >= installmentOrder?.tokens! &&
      //   !installmentOrder?.released
      // ) {
      //   await fetch(
      //     `${env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL}/api/tokens/${env.NEXT_PUBLIC_TOKENY_TOKEN_ID}/actions/mint`,
      //     {
      //       method: 'post',
      //       headers: {
      //         Authorization: `Bearer ${serviceToken}`,
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         // TODO replace to real ethereum network
      //         ethereumNetwork: 'AMOY',
      //         tokenQuantity: bonusToken(installmentOrder?.tokens!).toString(),
      //         walletAddress: candidate.wallet,
      //       }),
      //     },
      //   )
      //   await db.order.update({
      //     where: {
      //       id: installmentOrder?.id,
      //     },
      //     data: {
      //       released: true,
      //     },
      //   })
      // }
    }
  }
}
