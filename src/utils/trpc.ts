import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { AppRouter } from "../server/server";

export const trpcService = createTRPCReact<AppRouter>();

export const trpcClient = trpcService.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000'
    })
  ]
});
