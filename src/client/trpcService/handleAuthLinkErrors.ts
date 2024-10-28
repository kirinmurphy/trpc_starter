import { TRPCLink, TRPCClientError } from "@trpc/react-query";
import { AppRouter } from "../../server/server";
import { AUTH_ERROR_MESSAGES } from "../../server/authentication/types";
import { isTRPCError } from "./isTRPCError";
import { csrfStore } from "./createHttpLink";
import { triggerCsrfErrorRetry } from "./triggerCsrfErrorRetry";
import { refreshTokens } from "./refreshTokens";
import { TRPCObserverType } from "./types";

interface HandleErrorsProps {
  err: unknown;
  req: Parameters<ReturnType<TRPCLink<AppRouter>>>[0];
  observer: TRPCObserverType;
  forward: ReturnType<TRPCLink<AppRouter>>
}

export async function handleAuthLinkErrors (props: HandleErrorsProps) {
  const { err, observer, forward, req } = props;
  
  if ( !isTRPCError(err) ) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    observer.error(new TRPCClientError(errorMessage));
    return; 
  }

  if ( err.message === AUTH_ERROR_MESSAGES.CSRF_ERROR) {
    triggerCsrfErrorRetry({ onRetryFailure: ({ message }) => { 
      observer.error(new TRPCClientError(message)); 
    }});
    return;
  }
  
  try {
    const refreshProps = { errorMsg: err?.message, path: req.op.path };
    if ( !await isTokenRefreshed(refreshProps) ) { 
      csrfStore.clearToken();
      observer.error(err); 
      return; 
    }

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
    csrfStore.clearToken();
    observer.error(getError(refreshErr));
  }
}

async function isTokenRefreshed ({ errorMsg, path }: { errorMsg: string, path: string }) {
  const isAccessTokenExpired = errorMsg === 'Token expired';
  const isRefreshRequest = !path.includes('auth.refreshToken');
  return isAccessTokenExpired && isRefreshRequest && await refreshTokens();
}

function getError (err: unknown) {
  const isClientError = err instanceof TRPCClientError;
  return isClientError ? err : new TRPCClientError('Unknown error');
}
