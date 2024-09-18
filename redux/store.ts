import { configureStore } from '@reduxjs/toolkit'

import { exchangeRateApi } from './services/exchange-rate'
import { holdersApi } from './services/holders'
import { orderApi } from './services/order'
import { qualificationApi } from './services/qualification'
import { servicingApi } from './services/servicing'
import { tokensApi } from './services/tokens'
import { walletsApi } from './services/wallets'

export const store = configureStore({
  reducer: {
    [qualificationApi.reducerPath]: qualificationApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [servicingApi.reducerPath]: servicingApi.reducer,
    [walletsApi.reducerPath]: walletsApi.reducer,
    [exchangeRateApi.reducerPath]: exchangeRateApi.reducer,
    [holdersApi.reducerPath]: holdersApi.reducer,
    [tokensApi.reducerPath]: tokensApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      qualificationApi.middleware,
      orderApi.middleware,
      servicingApi.middleware,
      walletsApi.middleware,
      exchangeRateApi.middleware,
      holdersApi.middleware,
      tokensApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
