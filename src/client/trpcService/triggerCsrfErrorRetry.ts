import { TRPCClientError } from "@trpc/client";
import { csrfStore } from "./createHttpLink";
import { TRPCObserverType } from "./types";

const CSRF_RETRY_PARAM = 'csrfRetry';

export function triggerCsrfErrorRetry (observer: TRPCObserverType) {
  csrfStore.clearToken();

  const url = new URL(window.location.href);
  const attempts = Number(url.searchParams.get(CSRF_RETRY_PARAM)) || 0;
  if ( attempts > 1 ) {
    observer.error(new TRPCClientError('Unable to establish secure session. Please try again later.'));
    return;
  }
  url.searchParams.set(CSRF_RETRY_PARAM, (attempts+1).toString());
  window.location.href = url.toString();
}
