import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { generateCsrfToken, setCsrfToken } from '../utils/csrfActions';
import {
  clearRefreshTokenCookie,
  decodeAccessTokenCookie,
  getAccessTokenCookie,
} from './jwtActions';
import { AUTH_STATUSES, ContextType } from './types';
import { clearAccessTokenCookie } from './jwtActions';

export async function createContext(
  options: CreateNextContextOptions
): Promise<ContextType> {
  const { req, res } = options;

  // res.on('finish', () => {});

  if (req.method === 'GET') {
    setCsrfToken({ res, token: generateCsrfToken() });
  }

  const accessToken = getAccessTokenCookie({ req });

  if (!accessToken) {
    return { ...options, userId: null, authStatus: AUTH_STATUSES.noToken };
  }

  try {
    const { userId } = decodeAccessTokenCookie({ accessToken });

    return { ...options, userId, authStatus: AUTH_STATUSES.authenticated };
  } catch (err: unknown) {
    const isTokenExpiredErr = err instanceof TokenExpiredError;
    const isInvalidTokenErr = err instanceof JsonWebTokenError;

    clearAccessTokenCookie({ res });

    if (!isTokenExpiredErr) {
      clearRefreshTokenCookie({ res });
    }

    const errorStatus = isTokenExpiredErr
      ? AUTH_STATUSES.tokenExpired
      : isInvalidTokenErr
        ? AUTH_STATUSES.invalidToken
        : AUTH_STATUSES.unknownError;

    return { ...options, userId: null, authStatus: errorStatus };
  }
}
