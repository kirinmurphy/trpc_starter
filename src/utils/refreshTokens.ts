import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../server/server";

let isRefreshing = false;

export async function refreshTokens () {
  if ( isRefreshing ) { return false; }

  try {
    isRefreshing = true;

    const refreshClient = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: import.meta.env.SERVER_URL || 'http://localhost:3000',
          fetch(url, options) {
            return fetch(url, { ...options,  credentials: 'include' });
          }
        }),
      ]
    });

    await refreshClient.auth.refreshToken.mutate();
    return true;
  } catch (err: unknown) {
    console.error('Token refresh failed: ', err);
  } finally {
    isRefreshing = false;
  }
}