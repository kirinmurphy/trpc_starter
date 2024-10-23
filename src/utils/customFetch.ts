export function customFetch (input: RequestInfo | URL, options?: RequestInit) {
  if ( typeof window !== 'undefined' && 'Cypress' in window ){
    return window.fetch(input,  { ...options, credentials: 'include' });
  }
  return fetch(input, { ...options, credentials: 'include' })
}
