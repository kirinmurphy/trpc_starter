import { initTRPC } from '@trpc/server';
import { AUTH_STATUSES, ContextType } from './authentication/types';
import { throwAuthError } from './authentication/throwAuthError';
import { clearCsrfToken, validateCsrfToken } from './utils/csrfActions';

const trpc = initTRPC.context<ContextType>().create();

const authedMiddleware = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throwAuthError(ctx.authStatus);
  }
  return next({ ctx });
});

const csrfMiddleware = trpc.middleware(async ({ ctx, next }) => {
  const { res, req } = ctx;

  if (!validateCsrfToken({ req })) {
    clearCsrfToken({ res });
    throwAuthError(AUTH_STATUSES.csrfError);
  }
  return next({ ctx });
});

export const router = trpc.router;

export const procedures = {
  publicQuery: trpc.procedure,
  protectedQuery: trpc.procedure.use(authedMiddleware),
  publicMutation: trpc.procedure.use(csrfMiddleware),
  protectedMutation: trpc.procedure.use(csrfMiddleware).use(authedMiddleware),
};
