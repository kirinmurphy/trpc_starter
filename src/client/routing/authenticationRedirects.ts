import { redirect } from '@tanstack/react-router';
import { ROUTE_URLS } from './routeUrls';
import { clearAuthCache, isAuthenticated } from './isAuthenticated';

export async function redirectIfAuthenticated () {
  console.log('redirectIfAuthenticated called');
  clearAuthCache();
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
  console.log('Authentication check result:', authenticated);
  // const cachedState = getCachedAuthState();
  if ( !authenticated ) {
    console.log('Redirecting to public homepage');
    throw redirect({ to: ROUTE_URLS.publicHomepage })
  }

  if ( !(await isAuthenticated()) ) {
    throw redirect({ to: ROUTE_URLS.publicHomepage });
  }
}
