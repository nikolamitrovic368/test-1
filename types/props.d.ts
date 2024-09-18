import type { ReactNode } from 'react'

export type ChildrenProps = {
  children: ReactNode
}

export type SearchParamsProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export type LocaleProps = {
  params: { locale: string }
}
