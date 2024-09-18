import { Options } from './types'

type Element = {
  helperText: string
  id: string
  label: string
  required: boolean
  type: string
  value: any
  options: Options
  hiddenWhen?: {
    id: string
    operator: 'empty' | 'oneOf'
    value?: string[]
  }
}

type Elements = Element[]

type ElementBox = {
  id: string
  layout: string
  legend: string
  type: string
  fields: Elements
}

type ElementBoxs = ElementBox[]

type Status = 'active' | 'locked' | 'complete'

export type InvestorStatusStatus = 'registered' | 'qualified' | 'pending'

export type Qualification = {
  progress: 0 | 20 | 40 | 80
  allowedCountries: any
  contactEmail: string
  investorPortalUrl: null
  investorStatus: InvestorStatusStatus
  languages: string[]
  milestones: any
  name: string
  supportUrl: null
}

export type Agreements = {
  instructions: string
  status: Status
  elements: Elements
}

export type MainData = {
  instructions: string
  status: Status
  elements: ElementBoxs
}

export type SumSubData = {
  id: string
  instructions: string
  label: string
  title: string
  status: string
  elements: []
  plugins: [
    {
      id: string
      type: string
      config: {
        provider: string
        data: {
          sdkToken: string
        }
      }
    },
  ]
}
