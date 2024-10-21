import jwt, { JwtPayload } from "jsonwebtoken";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { ACCESS_TOKEN_SECRET, getAccessTokenCookie } from "./jwtCookies";
import { ContextType } from "./types";

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;
  const accessToken = getAccessTokenCookie({ req });
  
  if ( !accessToken ) {
    return { req, res, userId: null }
  }

  const { userId } = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;

  return { req, res, userId };
}
