import { trpcVanillaClient } from '../trpcService/trpcClientService';
import { refreshTokens } from '../trpcService/refreshTokens';

export async function isAuthenticated (): Promise<boolean> {
  try {
    const result = await trpcVanillaClient.auth.isAuthenticated.query();  

    if ( result.isAuthenticated ) { return true; }

    try {
      if ( await refreshTokens() ) {
        const retryResult = await trpcVanillaClient.auth.isAuthenticated.query();
        return retryResult.isAuthenticated;     
      }
      
    } catch (refreshErr: unknown) {
      console.error('Token refresh failed:', refreshErr);
      return false;
    }  

    return false;
  } catch (err: unknown) {
    console.log('Unexpected error during auth check', err);
    return false;
  }
}
