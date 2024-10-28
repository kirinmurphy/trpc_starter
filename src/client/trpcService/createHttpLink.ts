import { httpBatchLink } from "@trpc/client";
import { customFetch } from "./customFetch";

const getCsrfStore = () => {
  let csrfToken: string | null = null;
  return {
    setToken: (token: string) => { csrfToken = token; },
    getToken: () => csrfToken,
    clearToken: () => { csrfToken = null; }
  }
};

export const csrfStore = getCsrfStore();

export function createHttpLink () {
  return httpBatchLink({
    url: import.meta.env.SERVER_URL || 'http://localhost:3000',
    fetch: async (url, options) => {
      return await customFetch(url, { ...options, credentials: 'include' });
    },
    headers: () => ({
      ['x-csrf-token']: csrfStore.getToken() || ''
    })    
  }); 
}