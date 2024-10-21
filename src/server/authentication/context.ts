import jwt, { JwtPayload } from "jsonwebtoken";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
// import { validateUserAuthQuery } from "./validateUserAuthQuery";
import { ACCESS_TOKEN_SECRET, getAccessTokenCookie } from "./jwtCookies";

export type ContextType = {
  req: CreateNextContextOptions['req'];
  res: CreateNextContextOptions['res'];
  userId: string | null
  // user: User | null;
}

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;
  console.log('req.cookie.headers', req.headers.cookie);
  // console.log('req.cookies', req.cookies);
  const accessToken = getAccessTokenCookie({ req });

  console.log('accessToken: ', accessToken);
  
  if ( !accessToken ) {
    return { req, res, userId: null }
  }

  const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;
  
  console.log('decoded.userId', decoded.userId);
  return { 
    req, 
    res, 
    userId: decoded.userId
    // userId: decoded.userId, 
  };
}
