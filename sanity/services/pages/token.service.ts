import { fetchSanity } from '@/sanity/fetch'
import {
  tokenDetailQuery,
  TokenDetailType,
} from '@/sanity/queries/pages/token.query'

export const fetchTokenDetailsPageData = (tokenId: string) =>
  fetchSanity<TokenDetailType>(tokenDetailQuery, {
    tags: ['tokenDetailPage'],
    params: { tokenId },
  })
