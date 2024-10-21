import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from '../App'
import { AuthenticatedHomepage } from '../modules/authenticated/AuthenticatedHomepage';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { ROUTE_URLS } from './routeUrls';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';

export const rootRoute = createRootRoute({
  component: App,
});

export const publicHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.publicHomepage,
  component: PublicHomepage,
  beforeLoad: redirectIfAuthenticated
});

export const loginRoute = createRoute({
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
  loginRoute,
  authenticatedHomepageRoute,
]);  
