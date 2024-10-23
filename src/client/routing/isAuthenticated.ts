import { trpcVanillaClient } from '../../utils/trpcClients';
import { refreshTokens } from '../../utils/refreshTokens';

interface IsAuthenticatedProps { 
  failGracefully?: boolean; 
}

export async function isAuthenticated (props?: IsAuthenticatedProps): Promise<boolean> {
  const { failGracefully = false } = props || {};

  try {
    const result = await trpcVanillaClient.auth.isAuthenticated.query();  

    if ( result.isAuthenticated ) { console.log('=== IS AUTHENTICATED'); return true; }

    try {
      if ( await refreshTokens({ failGracefully }) ) {
        const retryResult = await trpcVanillaClient.auth.isAuthenticated.query();
        return retryResult.isAuthenticated;     
      }
      
    } catch (refreshErr: unknown) {
      if ( !failGracefully ) {
        console.error('Token refresh failed:', refreshErr);
      }
      return false;
    }  

    return false;
  } catch (err: unknown) {
    console.log('Unexpected error during auth check', err);
    return false;
  }
}
