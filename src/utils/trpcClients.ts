import { 
  createTRPCProxyClient, 
  createTRPCReact, 
  httpBatchLink, 
  TRPCLink,
  TRPCClientError,
} from "@trpc/react-query";
import { observable } from "@trpc/server/observable";
import { AppRouter } from "../server/server";
import { QueryClient } from "@tanstack/react-query";
import { refreshTokens } from "./refreshTokens";
import { isTRPCError } from "./isTRPCError";

export const queryClient = new QueryClient();
export const trpcService = createTRPCReact<AppRouter>();

function getAuthLink(): TRPCLink<AppRouter> {
  return (runtime) => {
    const forward = httpBatchLink({
      url: import.meta.env.SERVER_URL || 'http://localhost:3000',
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' })
      }
    })(runtime);

    return (req) => {
      return observable(observer => {
        const subscription = forward(req).subscribe({
          next(value) { console.log('continuing'); observer.next(value); },

          async error(err: unknown) {
            console.log('err', err);

            if ( !isTRPCError(err) ) {
              const cause = err instanceof Error ? err : new Error(String(err));
              observer.error(new TRPCClientError('Unknown error', { cause }));
              return; 
            }
            
            try {
              const refreshed = await isTokenRefreshed({ errorMsg: err?.message, path: req.op.path });
              if ( !refreshed ) { observer.error(err); return; }

              forward(req).subscribe({
                next(value) {
                  observer.next(value);
                  observer.complete();
                },
                error(retryErr: unknown) {
                  observer.error(getError(retryErr));
                },
                complete() {
                  observer.complete();
                },
              });
            } catch (refreshErr: unknown) {
              observer.error(getError(refreshErr));
            }
          },

          complete() {
            observer.complete();
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      });
    };
  };
}

export const trpcReactClient = trpcService.createClient({
  links: [getAuthLink()]
});

export const trpcVanillaClient = createTRPCProxyClient<AppRouter>({
  links: [getAuthLink()]
});

async function isTokenRefreshed ({ errorMsg, path }: { errorMsg: string, path: string }) {
  const isAccessTokenExpired = errorMsg === 'Token expired';
  const isRefreshRequest = !path.includes('auth.refreshToken');
  return isAccessTokenExpired && isRefreshRequest && await refreshTokens();
}

function getError (err: unknown) {
  const isClientError = err instanceof TRPCClientError;
  return isClientError ? err : new TRPCClientError('Unknown error');
}
