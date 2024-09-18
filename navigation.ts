import { createSharedPathnamesNavigation } from 'next-intl/navigation'

import { locales } from './config/localesConfig'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })
