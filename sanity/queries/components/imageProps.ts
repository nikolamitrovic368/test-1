import { groq } from 'next-sanity'

export type ImageProps = {
  src: string
  width: number
  height: number
}

export type Images = ImageProps[]

export const imageProps = groq`
{
  ...asset-> {
    "src": url,
    ...metadata { ...dimensions { width, height }} 
  }
}
`

export const withImageProps = groq`
{
  ...,
  image ${imageProps}
}
`
