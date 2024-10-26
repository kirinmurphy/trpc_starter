import { createTRPCProxyClient, TRPCClientError } from "@trpc/client";
import { AppRouter } from "../../server/server";
import { clearAuthQueries } from "./invalidateQueries";
import { createHttpLink, csrfStore } from "./createHttpLink";
import { AUTH_ERROR_MESSAGES } from "../../server/authentication/types";

let isRefreshing = false;

export async function refreshTokens () {
  if ( isRefreshing ) { return false; }

  try {
    isRefreshing = true;

    const refreshClient = createTRPCProxyClient<AppRouter>({
      links: [createHttpLink()]
    });

    await refreshClient.auth.refreshToken.mutate();
    return true;
  } catch (err: unknown) {
    console.error('Token refresh failed: ', err);

    if ( err instanceof TRPCClientError ) {
      if ( err.message === AUTH_ERROR_MESSAGES.CSRF_ERROR) {
        // TODO: ADD REFRESH ATTEMPT SO WE DON'T GET AN IN FINITE LOOP 
        // TODO: SHOULD WE DO THIS EVERYWHERE CLEAR TOKEN IS HAPPENING? 
        csrfStore.clearToken();
      }

      if ( err.message !== AUTH_ERROR_MESSAGES.NO_REFRESH_TOKEN) {
        await clearAuthQueries();
      }
    }
    return false;
  } finally {
    isRefreshing = false;
  }
}

