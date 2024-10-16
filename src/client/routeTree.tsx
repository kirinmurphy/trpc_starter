// src/routeTree.tsx
import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import Login from './components/auth/login'
import { Homepage } from './components/homepage/homepage';

export const rootRoute = createRootRoute({
  component: App,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Homepage,
});

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

export const routeTree = rootRoute.addChildren([
  indexRoute, 
  loginRoute
]);
