import { hubspotRouter } from './routers/hubspot'
import { onesignalRouter } from './routers/onesignal'
import { orderRouter } from './routers/order'
import { paypalRouter } from './routers/paypal'
import { sumsubRouter } from './routers/sumsub'
import { tokenRouter } from './routers/token'
import { createCallerFactory, createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  order: orderRouter,
  token: tokenRouter,
  onesignal: onesignalRouter,
  sumsub: sumsubRouter,
  hubspot: hubspotRouter,
  paypal: paypalRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
