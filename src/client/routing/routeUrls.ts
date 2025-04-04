export type RouteUrlsEnum = (typeof ROUTE_URLS)[keyof typeof ROUTE_URLS];

export const ROUTE_URLS = {
  publicHomepage: '/',
  authenticatedHomepage: '/home',
  createAccount: '/signup',
  login: '/login',
  verifyAccount: '/verify-account',
  requestResetPasswordEmail: '/request-reset-password-email',
  resetPassword: '/reset-password',
  superAdminSetup: '/admin-setup',
  // TODO PR: create fail page
  superAdminSetupFail: '/resend-admin-setup-email',
} as const;
