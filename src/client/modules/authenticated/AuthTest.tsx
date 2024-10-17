import  { useState, useEffect } from 'react';
import { handleInvalidRefreshToken, isAuthenticated } from '../../routing/isAuthenticated';
import { trpcVanillaClient } from '../../../utils/trpc';
import { isTRPCError } from '../../routing/isTRPCError';


export default function AuthTestComponent() {
  const [authStatus, setAuthStatus] = useState('Not checked');

  const checkAuth = async () => {
    const auth = await isAuthenticated();
    setAuthStatus(auth ? 'Authenticated' : 'Not authenticated');
  };

  const makeAuthRequest = async () => {
    try {
      // Replace this with an actual authenticated request
      const result = await trpcVanillaClient.someAuthenticatedEndpoint.query();
      console.log('Auth request successful:', result);
    } catch (error) {
      console.error('Auth request failed:', error);
      if ( isTRPCError(error) ) {
        if (error.data?.code === 'UNAUTHORIZED') {
          await handleInvalidRefreshToken();
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Auth Test</h2>
      <p>Current auth status: {authStatus}</p>
      <button onClick={checkAuth}>Check Auth</button>
      <button onClick={makeAuthRequest}>Make Auth Request</button>
    </div>
  );
}