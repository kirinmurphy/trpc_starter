import React from 'react';
import { createRoute, redirect, RouteOptions } from '@tanstack/react-router';
import { AuthenticatedApp } from '../../modules/authenticated/AuthenticatedApp';
import { getCurrentAppState } from '../getCurrentAppState';
import { ROUTE_URLS } from '../routeUrls';
import { rootRoute } from './rootRoute';
import { RouteWrapperProps } from './types';

export function createAuthenticatedRoute(props: RouteWrapperProps) {
  const { path, component: UserComponent, routeLoader, ...safeOptions } = props;

  return createRoute({
    ...safeOptions,
    path,
    getParentRoute: () => rootRoute,
    loader: async (context) => {
      const appState = await getCurrentAppState();
      if (!appState.isAuthenticated) {
        throw redirect({ to: ROUTE_URLS.publicHomepage });
      }

      if (routeLoader) {
        const routeData = await routeLoader(context);
        return { appState, routeData };
      }

      return { appState };
    },

    component: () => {
      return React.createElement(
        AuthenticatedApp,
        null,
        React.createElement(UserComponent, null)
      );
    },
  } as RouteOptions);
}
