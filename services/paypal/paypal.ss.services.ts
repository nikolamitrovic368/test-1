import { env } from '@/env'

export default async function generateAccessToken() {
  // To base64 encode your client id and secret using NodeJs
  const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
    `${env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
  ).toString('base64')

  const request = await fetch(`${env.PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      response_type: 'id_token',
      intent: 'sdk_init',
    }),
  })
  const json = await request.json()
  return json.access_token as string
}
