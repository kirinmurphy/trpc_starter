import { csrfStore } from './createHttpLink';

export function customFetch(input: RequestInfo | URL, options?: RequestInit) {
  const fetchFn =
    typeof window !== 'undefined' && 'Cypress' in window ? window.fetch : fetch;

  return fetchFn(input, options)
    .then((response) => {
      const csrfToken = response.headers.get('x-csrf-token');
      if (csrfToken) {
        csrfStore.setToken(csrfToken);
      }
      return response;
    })
    .catch((err) => {
      console.error('CustomFetch Error:', err);
      throw err;
    });
}
