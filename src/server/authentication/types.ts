import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export type User = {
  id: number;
  name: string;
  email: string;
}

export const AUTH_STATUSES = {
  noToken: 'NO_TOKEN',
  noRefreshToken: 'NO_REFRESH_TOKEN',
  authenticated: 'AUTHENTICATED',
  tokenExpired: 'TOKEN_EXPIRED',
  invalidToken: 'INVALID_TOKEN',
  unknownError: 'UNKNOWN_ERROR',
} as const;

export const AUTH_ERROR_MESSAGES = {
  [AUTH_STATUSES.noToken]: 'No token provided',
  [AUTH_STATUSES.noRefreshToken]: 'No refresh token provided',
  [AUTH_STATUSES.tokenExpired]: 'Token expired',
  [AUTH_STATUSES.invalidToken]: 'Invalid token',
  [AUTH_STATUSES.unknownError]: 'Authentication error',
  [AUTH_STATUSES.authenticated]: null
}

export type AuthStatusOptionType =  typeof AUTH_STATUSES[keyof typeof AUTH_STATUSES];

export type ContextType = {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
  userId: string | null;
  authStatus: AuthStatusOptionType;
}

export interface MutationPropsWithInput<InputType> {
  input: InputType
  ctx: ContextType
}

export interface SimpleMutationReturnType { 
  success: boolean; 
  message: string; 
}
