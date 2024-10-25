import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from '../App'
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';
import { ROUTE_URLS } from './routeUrls';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';
import { SignUpRedirectWrapper } from './SignUpRedirectWrapper';
import { PublicApp } from '../modules/public/PublicApp';

export const rootRoute = createRootRoute({
  component: App,
});

export const publicHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.publicHomepage,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><PublicHomepage/></PublicApp>,
});

export const signUpPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.signUp,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><SignUpRedirectWrapper/></PublicApp>,
});

export const loginPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.login,
  beforeLoad: redirectIfAuthenticated,
  component: () => <PublicApp><LoginRedirectWrapper/></PublicApp>,
});

export const authenticatedHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.authenticatedHomepage,
  beforeLoad:  redirectIfNotAuthenticated,
  component: () => <AuthenticatedApp><AuthenticatedHomepage /></AuthenticatedApp>,
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  loginPageRoute,
  signUpPageRoute,
  authenticatedHomepageRoute,
]);  
