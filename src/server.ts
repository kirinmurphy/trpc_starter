import { publicProcedure, router } from "./router";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import { z } from "zod";

const AstroResponseSchema = z.object({
  message: z.string(),
  number: z.number(),
  people: z.array(
    z.object({
      name: z.string(),
      craft: z.string()
    })
  )
});

type AstroResponse = z.infer<typeof AstroResponseSchema>;

export const appRouter = router({
  getAstronautsOnISS: publicProcedure
    .output(AstroResponseSchema)
    .query(async (): Promise<AstroResponse> => {   
      const response = await fetch(`http://api.open-notify.org/astros.json`);
      const data = await response.json();
      console.log('DATAAAAAA', data);
      return AstroResponseSchema.parse(data);
    }),
});

const server = createHTTPServer({
  router: appRouter,
  middleware: cors()
});

server.listen(3000);
console.log('Server running on port 3000');

export type AppRouter = typeof appRouter;
