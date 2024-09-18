import { fetchSanity } from '@/sanity/fetch'
import {
  banksQuery,
  BanksType,
  nonSerbiaBanksQuery,
  serbiaBanksQuery,
} from '@/sanity/queries/documents/bank.query'

export const fetchBanksData = () =>
  fetchSanity<BanksType>(banksQuery, { tags: ['banks'] })

export const fetchSerbiaBanksData = () =>
  fetchSanity<BanksType>(serbiaBanksQuery, { tags: ['serbiabanks'] })

export const fetchNonSerbiaBanksData = () =>
  fetchSanity<BanksType>(nonSerbiaBanksQuery, { tags: ['nonserbiabanks'] })
