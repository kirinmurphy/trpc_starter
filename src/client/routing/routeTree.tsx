import { z } from 'zod';
import { createRootRoute, createRoute } from '@tanstack/react-router'
import { ERR_VERIFICATION_FAILED } from '../../utils/messageCodes';
import App from '../App'
import { PublicApp } from '../modules/public/PublicApp';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { VerifyAccount } from '../modules/public/authenticating/VerifyAccount';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { ROUTE_URLS } from './routeUrls';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import { CreateAccount } from '../modules/public/authenticating/CreateAccount';

const rootRoute = createRootRoute({
  component: App,
});

const publicHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.publicHomepage,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><PublicHomepage/></PublicApp>,
});

const signUpPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.signUp,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><CreateAccount/></PublicApp>,
});

const loginPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.login,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><LoginRedirectWrapper/></PublicApp>,
  validateSearch: z.object({
    notification: z.enum([ERR_VERIFICATION_FAILED] as const).optional()
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
  component: () => <PublicApp><VerifyAccount/></PublicApp>,
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  loginPageRoute,
  signUpPageRoute,
  authenticatedHomepageRoute,
  verifyAccountRoute
]);  
