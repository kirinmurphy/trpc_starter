import { trpcVanillaClient } from '../../utils/trpcClients';
import { refreshTokens } from '../../utils/refreshTokens';

interface IsAuthenticatedProps { 
  checkForRefreshToken: boolean; 
}

export async function isAuthenticated (props: IsAuthenticatedProps): Promise<boolean> {
  const { checkForRefreshToken } = props;
  
  try {
    const result = await trpcVanillaClient.auth.isAuthenticated.query();  

    if ( result.isAuthenticated ) { return true; }

    if ( checkForRefreshToken ) {
      try {
        if ( await refreshTokens() ) {
          const retryResult = await trpcVanillaClient.auth.isAuthenticated.query();
          return retryResult.isAuthenticated;     
        }
      } catch (refreshErr: unknown) {
        console.error('Token refresh failed:', refreshErr);
        return false;
      }  
    }

    return false;
  } catch (err: unknown) {
    console.log('Unexpected error during auth check', err);
    return false;
  }
}
