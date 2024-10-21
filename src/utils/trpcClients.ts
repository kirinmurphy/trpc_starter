import { createTRPCProxyClient, createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "../server/server";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const trpcService = createTRPCReact<AppRouter>();

const httpLink = httpBatchLink({
  url: 'http://localhost:3000',
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: 'include', 
    });
  },
});

export const trpcReactClient = trpcService.createClient({
  links: [httpLink]
});

export const trpcVanillaClient = createTRPCProxyClient<AppRouter>({
  links: [httpLink]
});
