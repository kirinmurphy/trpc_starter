import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "./authentication/types";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

const isAuthedMiddleware = t.middleware(async ({ ctx, next }) => {
  const isLogout = isLogoutRoute(ctx.req.url);

  if ( isLogout ) {
    return next({ ctx: { user: null } });
  }

  if ( !ctx.user ) {
    console.log('UNAUUUUTHED');
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  return next({ ctx: { user: ctx.user } });
});

export const publicProcedure = t.procedure;
export const authenticatedProcedure = t.procedure.use(isAuthedMiddleware);


function isLogoutRoute (url?: string): boolean {
  if (!url) return false;
  return url.includes('auth.logout');
}