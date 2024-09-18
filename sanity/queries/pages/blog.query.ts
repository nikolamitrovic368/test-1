import { groq } from 'next-sanity'

import { Slug } from '@/sanity/types'

import { ImageProps, imageProps } from '../components/imageProps'

export type BlogType = {
  title: string
  body: any
  attachments: {
    label: string
    src: string
  }[]
  date: string
  image: ImageProps
  slug: Slug
}

export const blogQuery = groq`
*[_type == "blog" && slug.current == $slug][0] {
  ...,
  image ${imageProps},
  attachments[] {
    label,
    ...asset-> {
      "src": url
    }
  },
}
`
