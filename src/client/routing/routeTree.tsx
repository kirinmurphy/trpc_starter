import { z } from 'zod';
import { redirect } from '@tanstack/react-router';
import { LOGIN_NOTIFICATIONS } from '../../utils/messageCodes';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { VerifyAccount } from '../modules/public/authenticating/createAccount/VerifyAccount';
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { CreateAccount } from '../modules/public/authenticating/createAccount/CreateAccount';
import { RequestResetPasswordEmail } from '../modules/public/authenticating/resetPassword/RequestResetPasswordEmail';
import { VerifyPasswordResetToken } from '../modules/public/authenticating/resetPassword/VerifyPasswordResetToken';
import { tokenVerificationLoader } from '../utils/tokenVerificationLoader';
import { trpcVanillaClient } from '../trpcService/trpcClientService';
import { invalidateAuthCheckQuery } from '../trpcService/invalidateQueries';
import { ROUTE_URLS } from './routeUrls';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import {
  createAuthenticatedRoute,
  createPublicRoute,
  rootRoute,
} from './createRouteWrappers';

// -- PUBLIC ROUTES
const publicHomepageRoute = createPublicRoute({
  path: ROUTE_URLS.publicHomepage,
  component: PublicHomepage,
});

const createAccountPageRoute = createPublicRoute({
  path: ROUTE_URLS.createAccount,
  component: CreateAccount,
});

const loginPageRoute = createPublicRoute({
  path: ROUTE_URLS.login,
  component: LoginRedirectWrapper,
  validateSearch: z.object({
    notification: z.enum(LOGIN_NOTIFICATIONS).optional(),
  }),
});

const verifyAccountRoute = createPublicRoute({
  path: ROUTE_URLS.verifyAccount,
  component: VerifyAccount,
  loader: async (context) => {
    const token = new URLSearchParams(context.location.search).get('token');
    const preloadData = await tokenVerificationLoader<
      typeof trpcVanillaClient.auth.verifyAccount
    >({
      token,
      verifyTokenProcedure: trpcVanillaClient.auth.verifyAccount,
      redirectToOnError: ROUTE_URLS.login,
    });

    if (preloadData.success) {
      await invalidateAuthCheckQuery();
      throw redirect({ to: ROUTE_URLS.authenticatedHomepage });
    }

    return preloadData;
  },
});

const requestResetPasswordEmailRoute = createPublicRoute({
  path: ROUTE_URLS.requestResetPasswordEmail,
  component: RequestResetPasswordEmail,
});

const resetPasswordRoute = createPublicRoute({
  path: ROUTE_URLS.resetPassword,
  component: VerifyPasswordResetToken,
  loader: async (context) => {
    const token = new URLSearchParams(context.location.search).get('token');
    return tokenVerificationLoader<
      typeof trpcVanillaClient.auth.verifyPasswordResetToken
    >({
      token,
      verifyTokenProcedure: trpcVanillaClient.auth.verifyPasswordResetToken,
      redirectToOnError: ROUTE_URLS.requestResetPasswordEmail,
    });
  },
});

const superAdminSetupRoute = createPublicRoute({
  path: ROUTE_URLS.superAdminSetup,
  component: () => <div>heyyyyy</div>,
});

// -- AUTHENTICATED ROUTES
const authenticatedHomepageRoute = createAuthenticatedRoute({
  path: ROUTE_URLS.authenticatedHomepage,
  component: AuthenticatedHomepage,
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  loginPageRoute,
  createAccountPageRoute,
  authenticatedHomepageRoute,
  verifyAccountRoute,
  requestResetPasswordEmailRoute,
  resetPasswordRoute,
  superAdminSetupRoute,
]);
