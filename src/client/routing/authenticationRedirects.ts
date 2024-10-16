import { redirect } from '@tanstack/react-router';
import { trpcVanillaClient } from '../../utils/trpc';
import { ROUTE_URLS } from './routeUrls';

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

let cachedAuthState: boolean | null = null;
// let authCheckPromise: Promise<boolean> | null = null;

async function isAuthenticated () {
  console.log('isAuthenticated called, current authState:', cachedAuthState);
  
  if ( cachedAuthState !== null ) { return cachedAuthState; }

  try {
    const result = await trpcVanillaClient.auth.validateUser.query();
    cachedAuthState = result.isAuthenticated;
    console.log('Server validation result:', result.isAuthenticated);
    return result.isAuthenticated;
  } catch (err) {
    console.error('Authentication check failed:', err);
    return false;
  }
}

export function getCachedAuthState (): boolean | null {
  return cachedAuthState;
}

export function setAuthState(state: boolean) {
  console.log('setting authState to', state);
  cachedAuthState = state;
}

export function clearAuthCache () {
  cachedAuthState = null;
}
