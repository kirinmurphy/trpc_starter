import { TRPCClientError } from '@trpc/client';
import { queryClient, trpcVanillaClient } from '../../utils/trpc';
import { ROUTE_URLS } from './routeUrls';

export async function isAuthenticated () {

  try {
    const result = await trpcVanillaClient.auth.authCheck.query();
    return result.isAuthenticated;
  } catch (err: unknown) {
    if ( err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED' ) {
      if ( err.message === 'TokenExpired' ) {
        const refreshed = await getRefreshToken();
        if ( refreshed ) { return isAuthenticated(); }
      }
    }
    console.error('Auth check failed: ', err);
    return false;
  }
}

async function getRefreshToken () {
  try {
    const result = await trpcVanillaClient.auth.refreshToken.mutate()
    return result.success;
  } catch (err: unknown) {
    console.error('Failed to refresh token:', err);
    await handleInvalidRefreshToken();
    return false;
  }
}

export async function handleInvalidRefreshToken() {
  console.log('handleInvalidRefreshToken called');
  
  // Clear all queries
  console.log('Invalidating queries');
  await queryClient.invalidateQueries();
  console.log('Removing queries');
  queryClient.removeQueries();

  // Clear any auth-related local storage
  console.log('Clearing local storage');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');

  // Clear any auth-related session storage
  console.log('Clearing session storage');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('refresh_token');

  // Clear any auth-related cookies
  console.log('Clearing cookies');
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  console.log('Redirecting to public homepage');
  window.location.href = ROUTE_URLS.publicHomepage;
}