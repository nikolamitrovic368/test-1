import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    APP_SECRET_KEY: z.string().min(1),
    AUTH0_SECRET: z.string().min(1),
    AUTH0_BASE_URL: z.string().url(),
    AUTH0_ISSUER_BASE_URL: z.string().url(),
    AUTH0_CLIENT_ID: z.string().min(1),
    AUTH0_CLIENT_SECRET: z.string().min(1),
    AUTH0_AUDIENCE: z.string().min(1),
    AUTH0_SCOPE: z.string().min(1),
    SUMSUB_APP_TOKEN: z.string().min(1),
    SUMSUB_SECRET_KEY: z.string().min(1),
    SUMSUB_WEBHOOK_SECRET_KEY: z.string().min(1),
    TOKENY_SERVICE_API_EMAIL: z.string().min(1),
    TOKENY_SERVICE_API_PASSWORD: z.string().min(1),
    HUBSPOT_ACCESS_TOKEN: z.string().min(1),
    WS_PAY_SECRET_KEY: z.string().min(1),
    SANITY_VIEWER_TOKEN: z.string().min(1),
    SANITY_ENABLE_PREVIEW: z.string().min(1),
    ONESIGNAL_REST_API_KEY: z.string().min(1),
    ONESIGNAL_USER_AUTH_KEY: z.string().min(1),
    PAYPAL_CLIENT_SECRET: z.string().min(1),
    PAYPAL_API_BASE_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID: z.string().min(1),
    NEXT_PUBLIC_TOKENY_TOKEN_ID: z.string().min(1),
    NEXT_PUBLIC_TOKENY_TRADER_BASE_URL: z.string().url(),
    NEXT_PUBLIC_TOKENY_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID: z.string().min(1),
    NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_WS_PAY_URL: z.string().url(),
    NEXT_PUBLIC_WS_PAY_SHOP_ID: z.string().min(1),
    NEXT_PUBLIC_WS_PAY_VERSION: z.string().min(1),
    NEXT_PUBLIC_WS_PAY_RETURN_URL: z.string().url(),
    NEXT_PUBLIC_WS_PAY_RETURN_ERROR_URL: z.string().url(),
    NEXT_PUBLIC_WS_PAY_CANCEL_URL: z.string().url(),
    NEXT_PUBLIC_TOKENY_INVESTOR_APP_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1),
    NEXT_PUBLIC_SANITY_STUDIO_URL: z.string().min(1),
    NEXT_PUBLIC_REVALIDATE: z.string().min(1),
    NEXT_PUBLIC_ONESIGNAL_APP_ID: z.string().min(1),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID:
      process.env.NEXT_PUBLIC_TOKENY_QUALIFICATION_MODULE_ID,
    NEXT_PUBLIC_TOKENY_TOKEN_ID: process.env.NEXT_PUBLIC_TOKENY_TOKEN_ID,
    NEXT_PUBLIC_TOKENY_INVESTOR_APP_ID:
      process.env.NEXT_PUBLIC_TOKENY_INVESTOR_APP_ID,
    NEXT_PUBLIC_TOKENY_TRADER_BASE_URL:
      process.env.NEXT_PUBLIC_TOKENY_TRADER_BASE_URL,
    NEXT_PUBLIC_TOKENY_API_BASE_URL:
      process.env.NEXT_PUBLIC_TOKENY_API_BASE_URL,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL:
      process.env.NEXT_PUBLIC_TOKENY_SERVICING_API_BASE_URL,
    NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID:
      process.env.NEXT_PUBLIC_TOKENY_SUBSCRIPTION_ID,
    NEXT_PUBLIC_WS_PAY_URL: process.env.NEXT_PUBLIC_WS_PAY_URL,
    NEXT_PUBLIC_WS_PAY_SHOP_ID: process.env.NEXT_PUBLIC_WS_PAY_SHOP_ID,
    NEXT_PUBLIC_WS_PAY_VERSION: process.env.NEXT_PUBLIC_WS_PAY_VERSION,
    NEXT_PUBLIC_WS_PAY_RETURN_URL: process.env.NEXT_PUBLIC_WS_PAY_RETURN_URL,
    NEXT_PUBLIC_WS_PAY_RETURN_ERROR_URL:
      process.env.NEXT_PUBLIC_WS_PAY_RETURN_ERROR_URL,
    NEXT_PUBLIC_WS_PAY_CANCEL_URL: process.env.NEXT_PUBLIC_WS_PAY_CANCEL_URL,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_STUDIO_URL: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    NEXT_PUBLIC_REVALIDATE: process.env.NEXT_PUBLIC_REVALIDATE,
    NEXT_PUBLIC_ONESIGNAL_APP_ID: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
})
