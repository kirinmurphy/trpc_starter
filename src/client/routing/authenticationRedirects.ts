import { redirect } from '@tanstack/react-router';
import { ROUTE_URLS } from './routeUrls';

import { isAuthenticated } from "./isAuthenticated";

export async function redirectIfAuthenticated () {
  if ( await isAuthenticated({ checkForRefreshToken: false }) ) {
    console.log('Redirecting to authenticated homepage');
    throw redirect({ to: ROUTE_URLS.authenticatedHomepage });
  }
}

export async function redirectIfNotAuthenticated () {
  if ( !await isAuthenticated({ checkForRefreshToken: true }) ) {
    console.log('Redirecting to public homepage');
    throw redirect({ to: ROUTE_URLS.publicHomepage })
  }
}
