import { createRoute, redirect, RouteOptions } from '@tanstack/react-router';
import { getCurrentAppState } from '../getCurrentAppState';
import { ROUTE_URLS } from '../routeUrls';
import { PublicRouteWrapper } from '../createRouteHelpers/PublicRouteWrapper';
import { rootRoute } from './rootRoute';
import { RouteWrapperProps } from './types';

export function createPublicRoute<TLoaderData = unknown>(
  props: RouteWrapperProps<TLoaderData>
) {
  const { path, component: UserComponent, routeLoader, ...safeOptions } = props;

  return createRoute({
    ...safeOptions,
    path,
    getParentRoute: () => rootRoute,
    loader: async (context) => {
      const appState = await getCurrentAppState();
      if (appState.isAuthenticated) {
        throw redirect({ to: ROUTE_URLS.authenticatedHomepage });
      }

      if (routeLoader) {
        const routeData = await routeLoader(context);
        return { appState, routeData };
      }

      return { appState };
    },
    component: () => (
      <PublicRouteWrapper path={path} children={UserComponent} />
    ),
  } as RouteOptions);
}
