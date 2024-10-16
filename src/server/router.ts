import { IncomingMessage, ServerResponse } from 'http';
import { initTRPC } from "@trpc/server";



export function createContext({ req, res }: { req: IncomingMessage, res: ServerResponse }) {
  return { req, res };
}

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
