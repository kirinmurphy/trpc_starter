import { queryClient, trpcVanillaClient } from '../../utils/trpc';
import { ROUTE_URLS } from './routeUrls';
import { TRPCClientError } from '@trpc/client';
import { TRPCErrorShape } from '@trpc/server/rpc';

let cachedAuthState: boolean | null = null;
// let authCheckPromise: Promise<boolean> | null = null;

export async function isAuthenticated () {
  console.log('isAuthenticated called, current authState:', cachedAuthState);
  
  if ( cachedAuthState !== null ) { return cachedAuthState; }

  try {
    const result = await trpcVanillaClient.auth.validateUser.query();
    cachedAuthState = result.isAuthenticated;
    console.log('Server validation result:', result.isAuthenticated);
    return result.isAuthenticated;
  } catch (err: unknown) {

    if ( isTRPCError(err) ) {
      if ( err.data?.code === 'UNAUTHORIZED' && err.message === 'Token expired') {

        const refreshed = await getRefreshToken();

        if ( refreshed ) { return isAuthenticated(); }
      }  
    }
    console.error('Authentication check failed:', err);
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

export async function handleInvalidRefreshToken () {
  setAuthState(false);
  clearAuthCache();
  await queryClient.invalidateQueries();
  queryClient.removeQueries();
  window.location.href = ROUTE_URLS.publicHomepage;
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

function isTRPCError (obj: unknown): obj is TRPCErrorShape {
  return (
    obj instanceof TRPCClientError && 
    obj && typeof obj === 'object' && 'message' in obj && (
      !('data' in obj) || 
      (typeof obj.data === 'object' && obj.data && 'code' in obj.data)
    )
  )
}