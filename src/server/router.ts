import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "./authentication/types";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

const isAuthedMiddleware = t.middleware(async ({ ctx, next }) => {
  if ( !ctx.user ) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  return next({ ctx: { user: ctx.user } });
});

export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(isAuthedMiddleware);
