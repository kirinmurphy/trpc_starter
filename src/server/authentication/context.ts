import { TokenExpiredError } from "jsonwebtoken";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { decodeAccessTokenCookie, getAccessTokenCookie } from "./jwtActions";
import { ContextType } from "./types";
import { clearAccessTokenCookie } from "./jwtActions";

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;

  const accessToken = getAccessTokenCookie({ req });
  
  if ( !accessToken ) {
    return { req, res, userId: null }
  }

  try {
    const { userId } = decodeAccessTokenCookie({ accessToken });

    return { req, res, userId };

  } catch ( err: unknown ) {
    if ( err instanceof TokenExpiredError ) {
      clearAccessTokenCookie({ res });
    }

    return { req, res, userId: null }
  }
}
