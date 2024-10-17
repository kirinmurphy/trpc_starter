import { redirect } from '@tanstack/react-router';
import { ROUTE_URLS } from './routeUrls';
import { isAuthenticated } from './isAuthenticated';

export async function redirectIfAuthenticated () {
  console.log('redirectIfAuthenticated called');
  const authenticated = await isAuthenticated();
  console.log('Authentication check result:', authenticated);
  if (authenticated) {
    console.log('Redirecting to authenticated homepage');
    throw redirect({ to: ROUTE_URLS.authenticatedHomepage });
  }
}

export async function redirectIfNotAuthenticated () {
  console.log('redirectIfNotAuthenticated called');
  const authenticated = await isAuthenticated();
  if ( !authenticated ) {
    console.log('Redirecting to public homepage');
    throw redirect({ to: ROUTE_URLS.publicHomepage })
  }
}
