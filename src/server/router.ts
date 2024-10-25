import { initTRPC } from "@trpc/server";
import { ContextType } from "./authentication/types";
import { throwAuthError } from "./authentication/throwAuthError";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

const authedMiddleware = t.middleware(async ({ ctx, next }) => {
  if ( !ctx.userId ) { throwAuthError(ctx.authStatus); }
  return next({ ctx });
});

export const protectedProcedure = t.procedure.use(authedMiddleware);
