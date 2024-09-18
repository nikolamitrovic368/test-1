import { groq } from 'next-sanity'

import { ImageProps, imageProps } from '../components/imageProps'

export type TokenDetailType = {
  tokenDetails: {
    ticker: string
    whitepaper: string
    commercialSummary: string
    description: any
    carbonCredit: string
    licenseNumber: string
  }
  tokenId: string
  report: {
    _id: string
    hazelnutRevenue: string
    impactRevenue: string
    year: number
    dividentPerToken: string
    totalForDistribution: string
    title: string
    costPerIncomeStream: string
    totalDividend: string
  }
  blogs: {
    title: string
    slug: {
      current: string
      _type: string
    }
    image: ImageProps
    date: string
  }[]
}
export const tokenDetailQuery = groq`
*[_type == "token" && tokenId == $tokenId ][0] {
  ...,
  image ${imageProps},
  blogs[]-> {
    title,
    date,
    slug,
    image ${imageProps}
  },
  report[0]-> {
    ...
  },
}
`
