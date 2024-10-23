import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { clearRefreshTokenCookie, decodeAccessTokenCookie, getAccessTokenCookie } from "./jwtActions";
import { AUTH_STATUSES, ContextType } from "./types";
import { clearAccessTokenCookie } from "./jwtActions";

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;

  const accessToken = getAccessTokenCookie({ req });
  
  if ( !accessToken ) {
    return { req, res, userId: null, authStatus: AUTH_STATUSES.noToken }
  }

  try {
    const { userId } = decodeAccessTokenCookie({ accessToken });

    return { req, res, userId, authStatus: AUTH_STATUSES.authenticated };

  } catch ( err: unknown ) {

    const isTokenExpiredErr = err instanceof TokenExpiredError;
    const isInvalidTokenErr = err instanceof JsonWebTokenError;

    clearAccessTokenCookie({ res });

    if ( !isTokenExpiredErr ) {
      console.log('NOT TOKEN EXPIRED ERROR', err);
      clearRefreshTokenCookie({ res });
    } else {
      console.log('------ ITOKENEXPERR', err);
    }

    const errorStatus = isTokenExpiredErr ? AUTH_STATUSES.tokenExpired
      : isInvalidTokenErr ? AUTH_STATUSES.invalidToken
      : AUTH_STATUSES.unknownError;
    
    return { 
      req, 
      res, 
      userId: null, 
      authStatus: errorStatus
    };
  }
}
