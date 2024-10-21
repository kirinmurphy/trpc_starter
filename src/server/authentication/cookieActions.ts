import cookie, { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';

export const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: new Date(0),
  path: '/'
} as const;

interface SetCookieProps {
  res: ServerResponse;
  token: string;
  name: string;
  maxAge: number;
}

export function setAuthCookie (props: SetCookieProps): void {
  const { res, token, name, maxAge } = props;
  const cookieString = cookie.serialize(name, token, { ...cookieDefaults, maxAge });  
  const existingCookies = res.getHeader('Set-Cookie') || [];
  const newCookies = Array.isArray(existingCookies)
    ? [...existingCookies, cookieString]
    : [existingCookies.toString(), cookieString];
  res.setHeader('Set-Cookie', newCookies);
}

interface ClearCookieProps { res: ServerResponse, req: IncomingMessage; cookieName: string }

export function clearAuthCookie ({ res, req, cookieName }: ClearCookieProps) {
  const cookiesBefore = req.headers.cookie;
  console.log(cookieName, ' after clearing:', cookiesBefore);
const cookieString = cookie.serialize(cookieName, '', {
    ...cookieDefaults,
    expires: new Date(0),
    maxAge: 0,
  });
  res.setHeader('Set-Cookie', cookieString);

  const cookiesAfter = req.headers.cookie;
  console.log(cookieName, ' after clearing:', cookiesAfter);
}

interface GetCookieValueProps { req: IncomingMessage, name: string  }

export function getCookieValue ({ req, name }: GetCookieValueProps): string | undefined {
  console.log('GETTING ACCESS TOOKEN', name);
  const cookieHeader = req.headers.cookie;
  console.log('cookieHeader', cookieHeader);
  if ( cookieHeader ) {
    const cookies = parse(cookieHeader);
    return cookies[name];
  }

  return undefined;
}
