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
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  console.log('import.meta.env', import.meta.env);
  
  return httpBatchLink({
    url,
    fetch: async (url, options) => {
      return await customFetch(url, { ...options, credentials: 'include' });
    },
    headers: () => ({
      ['x-csrf-token']: csrfStore.getToken() || ''
    })    
  }); 
}
