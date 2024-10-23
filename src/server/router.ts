import { initTRPC, TRPCError } from "@trpc/server";
import { 
  AUTH_ERROR_MESSAGES, 
  AUTH_STATUSES, 
  AuthStatusOptionType, 
  ContextType 
} from "./authentication/types";

const t = initTRPC.context<ContextType>().create();

export const router = t.router;

export function throwAuthError(authStatus: AuthStatusOptionType) {
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: AUTH_ERROR_MESSAGES[authStatus] 
      || AUTH_ERROR_MESSAGES[AUTH_STATUSES.unknownError]
  });  
}

const authedMiddleware = t.middleware(async ({ ctx, next }) => {
  console.log('in authedMiddleware');
  if ( !ctx.userId ) {
    throwAuthError(ctx.authStatus);
  }
  return next({ ctx });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authedMiddleware);
