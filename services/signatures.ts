import crypto from 'crypto'

import { env } from '@/env'

export const giftSignature = (tokenyOrderId: string) =>
  crypto
    .createHash('sha512')
    .update(`${tokenyOrderId}${env.APP_SECRET_KEY}`)
    .digest('hex')

export function createSumsubSignature(config: any) {
  var ts = Math.floor(Date.now() / 1000)
  const signature = crypto.createHmac('sha256', env.SUMSUB_SECRET_KEY)
  signature.update(ts + config.method.toUpperCase() + config.url)

  if (config.data instanceof FormData) signature.update(config.data.getBuffer())
  else if (config.data) signature.update(config.data)

  config.headers['X-App-Access-Ts'] = ts
  config.headers['X-App-Access-Sig'] = signature.digest('hex')

  return config
}
