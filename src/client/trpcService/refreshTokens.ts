import { createTRPCProxyClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import { AppRouter } from "../../server/server";
import { customFetch } from "./customFetch";
import { clearAuthQueries } from "./invalidateQueries";

let isRefreshing = false;

export async function refreshTokens () {
  if ( isRefreshing ) { return false; }

  try {
    isRefreshing = true;

    const refreshClient = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: import.meta.env.SERVER_URL || 'http://localhost:3000',
          fetch: customFetch
        }),
      ]
    });

    await refreshClient.auth.refreshToken.mutate();
    return true;
  } catch (err: unknown) {
    console.error('Token refresh failed: ', err);

    if ( err instanceof TRPCClientError ) {
      await clearAuthQueries();
    }      
    return false;
  } finally {
    isRefreshing = false;
  }
}
