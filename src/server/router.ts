import { initTRPC, TRPCError } from "@trpc/server";
import { ContextType } from "./authentication/types";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

const authedMiddleware = t.middleware(async ({ ctx, next }) => {
  try {
    console.log('whoooo');
    if ( !ctx.userId ) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    return next({ ctx });
  
  } catch (err) {
    if ( err instanceof Error && err.message === 'jwt expired' ) {
      console.log('heyooooooo');
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'JWT_EXPIRED' });
    }

    throw err;
  }
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authedMiddleware);
