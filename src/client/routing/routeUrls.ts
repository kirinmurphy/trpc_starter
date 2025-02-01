export type RouteUrlsEnum = (typeof ROUTE_URLS)[keyof typeof ROUTE_URLS];

export const ROUTE_URLS = {
  publicHomepage: '/',
  authenticatedHomepage: '/home',
  createAccount: '/signup',
  login: '/login',
  verifyAccount: '/verify-account',
  requestResetPasswordEmail: '/request-reset-password-email',
  resetPassword: '/reset-password'
} as const;
