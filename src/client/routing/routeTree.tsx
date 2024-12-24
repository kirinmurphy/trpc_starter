import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from '../App'
import { PublicApp } from '../modules/public/PublicApp';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { VerifyAccountInstructions } from '../modules/public/authenticating/VerifyAccountInstructions';
import { ROUTE_URLS } from './routeUrls';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import { SignUpRedirectWrapper } from './SignUpRedirectWrapper';
import { VerifyAccount } from '../modules/public/authenticating/VerifyAccount';

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
  component: () => <PublicApp><SignUpRedirectWrapper/></PublicApp>,
});

const loginPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.login,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><LoginRedirectWrapper/></PublicApp>,
});

const authenticatedHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.authenticatedHomepage,
  beforeLoad:  redirectIfNotAuthenticated,
  component: () => <AuthenticatedApp><AuthenticatedHomepage/></AuthenticatedApp>,
});

const verifyAccountInstructionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.verifyAccountInstructions,
  beforeLoad: redirectIfAuthenticated, 
  component: () => <PublicApp><VerifyAccountInstructions/></PublicApp>
});

const verifyAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.verifyAccount,
  beforeLoad: redirectIfAuthenticated, 
  component: VerifyAccount
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  loginPageRoute,
  signUpPageRoute,
  authenticatedHomepageRoute,
  verifyAccountInstructionsRoute,
  verifyAccountRoute
]);  
