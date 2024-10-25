import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../server/server";
import { customFetch } from "./customFetch";

let isRefreshing = false;

export async function refreshTokens (props?: { failGracefully?: boolean; }) {
  const { failGracefully = false } = props || {}; 
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
    if ( failGracefully ) {
      console.error('Token refresh failed: ', err);
    }
    return false;
  } finally {
    isRefreshing = false;
  }
}
