import jwt, { JwtPayload } from "jsonwebtoken";
import { IncomingMessage, ServerResponse } from 'http';
import { clearCookie, getCookieValue, setCookie } from "../utils/cookieActions";

interface GetCookieProps { req: IncomingMessage }
type GetCookieReturnType = string | undefined;
interface SetCookieProps { res: ServerResponse, userId: string | number }

const ACCESS_COOKIE_NAME = 'auth_token';
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.NODE_ENV === 'test' ? '6s' : '5s';

const REFRESH_COOKIE_NAME = 'refresh_token';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET!;
const REFRESH_TOKEN_EXPIRY = '7d';


// -- ACCESS TOKEN ------------ //
export function getAccessTokenCookie({ req }: GetCookieProps): GetCookieReturnType {
  return getCookieValue({ req, name: ACCESS_COOKIE_NAME  })
}

export function setAccessTokenCookie ({ res, userId }: SetCookieProps) {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { 
    expiresIn: ACCESS_TOKEN_EXPIRY 
  });
  setCookie({ res, value: accessToken, name: ACCESS_COOKIE_NAME });
}

export function decodeAccessTokenCookie ({ accessToken }: { accessToken: string }) {
  try {
    return jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch (err: unknown) {
    console.error('failed to decode access token: ', err);
    throw err;
  }
}  

export function clearAccessTokenCookie ({ res }: { res: ServerResponse }) {
  clearCookie({ res, name: ACCESS_COOKIE_NAME });
}

// -- REFRESH TOKEN ------------ //
export function getRefreshTokenCookie({ req }: GetCookieProps): GetCookieReturnType {
  return getCookieValue({ req, name: REFRESH_COOKIE_NAME  })
}

export function setRefreshTokenCookie ({ res, userId }: SetCookieProps) {
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  setCookie({ res, value: refreshToken, name: REFRESH_COOKIE_NAME });
}

export function decodeRefreshTokenCookie ({ refreshToken }: { refreshToken: string }) {
  try {
    return jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: number, exp: number }  
  } catch (err: unknown) {
    console.error('failed to decode access token: ', err);
    throw err;
  }
}

export function clearRefreshTokenCookie ({ res }: { res: ServerResponse }) {
  clearCookie({ res, name: REFRESH_COOKIE_NAME });
}
