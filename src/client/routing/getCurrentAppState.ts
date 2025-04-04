import { trpcVanillaClient } from '../trpcService/trpcClientService';
import { refreshTokens } from '../trpcService/refreshTokens';
import { SYSTEM_STATUS } from '../../server/systemStatus/types';

interface ReturnProps {
  isAuthenticated: boolean;
  systemStatus: SYSTEM_STATUS | null;
}

export async function getCurrentAppState(): Promise<ReturnProps> {
  try {
    const result = await trpcVanillaClient.auth.getAppState.query();

    if (result.isAuthenticated) {
      return result;
    }

    try {
      if (await refreshTokens()) {
        const retryResult = await trpcVanillaClient.auth.getAppState.query();
        return retryResult;
      }
    } catch (refreshErr: unknown) {
      console.error('Token refresh failed:', refreshErr);
      return result;
    }

    return result;
  } catch (err: unknown) {
    console.log('Unexpected error during auth check', err);
    return { isAuthenticated: false, systemStatus: null };
  }
}
