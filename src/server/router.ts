import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "./authentication/types";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

const authedMiddleware = t.middleware(async ({ ctx, next }) => {
  if ( !ctx.userId ) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({ ctx });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authedMiddleware);
