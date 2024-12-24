import { createTRPCProxyClient, createTRPCReact } from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";
import { AppRouter } from "../../server/server";
import { getAuthLink } from "./getAuthLink";

export const queryClient = new QueryClient();

export const trpcService = createTRPCReact<AppRouter>();

export const trpcReactClient = trpcService.createClient({
  links: [getAuthLink()]
});

export const trpcVanillaClient = createTRPCProxyClient<AppRouter>({
  links: [getAuthLink()]
});
