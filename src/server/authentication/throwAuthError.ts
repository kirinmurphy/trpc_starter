import { TRPCError } from '@trpc/server';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_STATUSES,
  AuthStatusOptionType,
} from './types';

const unknownError = AUTH_ERROR_MESSAGES[AUTH_STATUSES.unknownError];

export function throwAuthError(authStatus: AuthStatusOptionType) {
  throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: AUTH_ERROR_MESSAGES[authStatus] || unknownError,
  });
}
