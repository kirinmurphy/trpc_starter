import React from 'react';
import {
  createRootRoute,
  createRoute,
  RouteOptions,
} from '@tanstack/react-router';
import App from '../App';
import { PublicApp } from '../modules/public/PublicApp';
import { AuthenticatedApp } from '../modules/authenticated/AuthenticatedApp';
import {
  redirectIfAuthenticated,
  redirectIfNotAuthenticated,
} from './appStateRedirects';
import { APP_STATE } from '../../server/appState/appState';

export const rootRoute = createRootRoute({
  component: App,
});

type RequiredRouteProps = {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  requiredAppState?: typeof APP_STATE;
};

export function createPublicRoute<TOptions extends Partial<RouteOptions>>(
  props: RequiredRouteProps & TOptions
) {
  const {
    beforeLoad: userBeforeLoad,
    component: UserComponent,
    ...restOptions
  } = props;

  return createRoute({
    ...restOptions,
    getParentRoute: () => rootRoute,
    component: () => {
      return React.createElement(
        PublicApp,
        null,
        React.createElement(UserComponent, null)
      );
    },
    beforeLoad: async (context) => {
      if (userBeforeLoad) await userBeforeLoad(context);
      await redirectIfAuthenticated();
    },
  } as RouteOptions);
}

export function createAuthenticatedRoute<
  TOptions extends Partial<RouteOptions>,
>(props: RequiredRouteProps & TOptions) {
  const {
    beforeLoad: userBeforeLoad,
    component: UserComponent,
    ...restOptions
  } = props;

  return createRoute({
    ...restOptions,
    getParentRoute: () => rootRoute,
    component: () => {
      return React.createElement(
        AuthenticatedApp,
        null,
        React.createElement(UserComponent, null)
      );
    },
    beforeLoad: async (context) => {
      if (userBeforeLoad) await userBeforeLoad(context);
      await redirectIfNotAuthenticated();
    },
  } as RouteOptions);
}
