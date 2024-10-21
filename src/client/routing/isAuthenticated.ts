import { TRPCClientError } from '@trpc/client';
import { trpcVanillaClient } from '../../utils/trpcClients';
// import { trpcVanillaClient } from '../../utils/trpc';
// import { handleInvalidRefreshToken } from './handleInvalidRefreshToken';
// import { ROUTE_URLS } from './routeUrls';

export async function isAuthenticated () {
  try {
    const result = await trpcVanillaClient.auth.isAuthenticated.query();  
    return result.isAuthenticated;

  } catch (err: unknown) {
    if ( err instanceof TRPCClientError && err.data?.code === 'UNAUTHORIZED' ) {
      if ( err.message === 'TokenExpired' ) {
        // const refreshed = await getRefreshToken();
        // if ( refreshed ) { return isAuthenticated(); }
      }
    }
    console.error('Auth check failed: ', err);
    return false;
  }
}

// async function getRefreshToken () {
//   try {
//     const result = await trpcVanillaClient.auth.refreshToken.mutate()
//     return result.success;
//   } catch (err: unknown) {
//     console.error('Failed to refresh token:', err);
//     await handleInvalidRefreshToken();
//     return false;
//   }
// }
