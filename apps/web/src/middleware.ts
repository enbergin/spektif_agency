import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'tr',

  // Configure pathnames
  pathnames: {
    '/': '/',
    '/auth/login': '/auth/login',
    '/auth/register': '/auth/register',
    '/dashboard': '/dashboard',
    '/org/[orgId]/boards': '/org/[orgId]/boards',
    '/org/[orgId]/board/[boardId]': '/org/[orgId]/board/[boardId]',
    '/org/[orgId]/calendar': '/org/[orgId]/calendar',
    '/org/[orgId]/chat': '/org/[orgId]/chat',
    '/org/[orgId]/accounting': '/org/[orgId]/accounting',
    '/org/[orgId]/settings': '/org/[orgId]/settings'
  }
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(tr|en|pl)/:path*']
}
