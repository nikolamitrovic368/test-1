import { ImageProps } from '../queries/components/imageProps'

export type Image = {
  _type: 'image'
  asset: {
    _type: 'reference'
    _ref: string
  }
}

export type Slug = {
  current: string
  _type: 'slug'
}

export type CommonSection = {
  title: string
  subtitle: string
  _key?: string
}

export type Seo = {
  description: string
  keywords: string[]
  metaImage: ImageProps
  robotsNoFollow: boolean
  robotsNoIndex: boolean
  title: string
}
