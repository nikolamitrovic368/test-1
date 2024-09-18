import { draftMode } from 'next/headers'
import type { QueryParams, ResponseQueryOptions } from 'next-sanity'

import { env } from '@/env'

import client from './client'

export { default as groq } from 'groq'

export function fetchSanity<T = any>(
  query: string,
  {
    params = {},
    ...next
  }: {
    params?: QueryParams
  } & ResponseQueryOptions['next'] = {},
) {
  const preview = env.NODE_ENV === 'development' || draftMode().isEnabled

  return client.fetch<T>(
    query,
    params,
    preview
      ? {
          stega: true,
          perspective: 'previewDrafts',
          useCdn: false,
          token: env.SANITY_VIEWER_TOKEN,
          next: {
            revalidate: 0,
            ...next,
          },
        }
      : {
          perspective: 'published',
          useCdn: true,
          next: {
            revalidate: Number(env.NEXT_PUBLIC_REVALIDATE) || false,
            ...next,
          },
        },
  )
}
