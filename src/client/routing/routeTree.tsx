import { z } from 'zod';
import { createRootRoute, createRoute, redirect } from '@tanstack/react-router'
import { LOGIN_NOTIFICATIONS } from '../../utils/messageCodes';
import App from '../App'
import { PublicApp } from '../modules/public/PublicApp';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { VerifyAccount } from '../modules/public/authenticating/createAccount/VerifyAccount';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { CreateAccount } from '../modules/public/authenticating/createAccount/CreateAccount';
import { RequestResetPasswordEmail } from '../modules/public/authenticating/resetPassword/RequestResetPasswordEmail';
import { VerifyPasswordResetToken } from '../modules/public/authenticating/resetPassword/VerifyPasswordResetToken';
import { tokenVerificationLoader } from '../utils/tokenVerificationLoader';
import { trpcVanillaClient } from '../trpcService/trpcClientService';
import { invalidateAuthCheckQuery } from '../trpcService/invalidateQueries';
import { ROUTE_URLS } from './routeUrls';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';

const rootRoute = createRootRoute({
  component: App,
});

const publicHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.publicHomepage,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><PublicHomepage/></PublicApp>,
});

const createAccountPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.createAccount,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><CreateAccount/></PublicApp>,
});

const loginPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.login,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><LoginRedirectWrapper/></PublicApp>,
  validateSearch: z.object({
    notification: z.enum(LOGIN_NOTIFICATIONS).optional()
  }),
});

const authenticatedHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.authenticatedHomepage,
  beforeLoad:  redirectIfNotAuthenticated,
  component: () => <AuthenticatedApp><AuthenticatedHomepage/></AuthenticatedApp>,
});

const verifyAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.verifyAccount,
  beforeLoad: redirectIfAuthenticated, 
  component: () => <PublicApp><VerifyAccount<typeof verifyAccountRoute> /></PublicApp>,
  loader: async (context) => {
    const token = new URLSearchParams(context.location.search).get('token');
    const preloadData = await tokenVerificationLoader<typeof trpcVanillaClient.auth.verifyAccount>({
      token,
      verifyTokenProcedure: trpcVanillaClient.auth.verifyAccount,
      redirectToOnError: ROUTE_URLS.login,
    });

    if ( preloadData.success ) {
      await invalidateAuthCheckQuery();
      throw redirect({ to: ROUTE_URLS.authenticatedHomepage });  
    }

    return preloadData;
  },
});

const requestResetPasswordEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.requestResetPasswordEmail,
  beforeLoad: redirectIfAuthenticated, 
  component: () => <PublicApp><RequestResetPasswordEmail/></PublicApp>,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.resetPassword,
  beforeLoad: redirectIfAuthenticated, 
  component: () => <PublicApp><VerifyPasswordResetToken<typeof resetPasswordRoute>/></PublicApp>,
  loader: async (context) => {
    const token = new URLSearchParams(context.location.search).get('token');
    return tokenVerificationLoader<typeof trpcVanillaClient.auth.verifyPasswordResetToken>({
      token,
      verifyTokenProcedure: trpcVanillaClient.auth.verifyPasswordResetToken,      
      redirectToOnError: ROUTE_URLS.requestResetPasswordEmail
    });
  }
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  loginPageRoute,
  createAccountPageRoute,
  authenticatedHomepageRoute,
  verifyAccountRoute,
  requestResetPasswordEmailRoute,
  resetPasswordRoute
]);  
