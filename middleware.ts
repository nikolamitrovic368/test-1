import { NextFetchEvent, NextRequest } from 'next/server'
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const publicPages = ['/login']

const intlMiddleware = createMiddleware(routing)

const authMiddleware = withMiddlewareAuthRequired(
  async function middleware(_req) {
    return intlMiddleware(_req)
  },
)

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join('|')}))?(${publicPages
      .flatMap(p => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i',
  )
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return intlMiddleware(req)
  } else {
    return authMiddleware(req, event)
  }
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
