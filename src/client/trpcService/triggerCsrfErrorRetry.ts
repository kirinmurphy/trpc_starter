import { csrfStore } from './createHttpLink';

const CSRF_RETRY_PARAM = 'csrfRetry';

const csrfRetryErrorMessage =
  'Unable to establish secure session. Please try again later.';

interface TriggerCsrfErrorRetryProps {
  onRetryFailure: (props: { message: string }) => void;
}

export function triggerCsrfErrorRetry({
  onRetryFailure,
}: TriggerCsrfErrorRetryProps) {
  csrfStore.clearToken();

  const url = new URL(window.location.href);
  const attempts = Number(url.searchParams.get(CSRF_RETRY_PARAM)) || 0;
  if (attempts > 1) {
    onRetryFailure({ message: csrfRetryErrorMessage });
    return;
  }
  url.searchParams.set(CSRF_RETRY_PARAM, (attempts + 1).toString());
  window.location.href = url.toString();
}
