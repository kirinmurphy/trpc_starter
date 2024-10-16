import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from '../App'
import { Homepage } from '../modules/authenticated/homepage';
import { PublicHomepage } from '../modules/public/PublicHomepage';
import { ROUTE_URLS } from './routeUrls';
import { LoginRedirectWrapper } from './LoginRedirectWrapper';
import { redirectIfAuthenticated, redirectIfNotAuthenticated } from './authenticationRedirects';

export const rootRoute = createRootRoute({
  component: App,
});

export const publicHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.publicHomepage,
  component: PublicHomepage,
  beforeLoad: async () => {
    console.log('Public homepage beforeLoad called');
    await redirectIfAuthenticated();
  },
});

export const authenticatedHomepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.authenticatedHomepage,
  component: Homepage,
  beforeLoad:  async () => {
    console.log('Authenticated homepage beforeLoad called');
    await redirectIfNotAuthenticated();
  },
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTE_URLS.login,
  component: LoginRedirectWrapper,
  beforeLoad: redirectIfAuthenticated
});

export const routeTree = rootRoute.addChildren([
  publicHomepageRoute,
  authenticatedHomepageRoute,
  loginRoute
]);  
