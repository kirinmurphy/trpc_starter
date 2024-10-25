import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from '../App'
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';
import { ROUTE_URLS } from './routeUrls';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';
import { SignUpRedirectWrapper } from './SignUpRedirectWrapper';

export const rootRoute = createRootRoute({
  component: App,
});

export const publicHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.publicHomepage,
  component: PublicHomepage,
  beforeLoad: redirectIfAuthenticated
});

export const signUpPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.signUp,
  component: SignUpRedirectWrapper,
  beforeLoad: redirectIfAuthenticated
});

export const loginPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.login,
  component: LoginRedirectWrapper,
  beforeLoad: redirectIfAuthenticated
});

export const authenticatedHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.authenticatedHomepage,
  component: () => <AuthenticatedApp><AuthenticatedHomepage /></AuthenticatedApp>,
  beforeLoad:  redirectIfNotAuthenticated,
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  loginPageRoute,
  signUpPageRoute,
  authenticatedHomepageRoute,
]);  
