import cookie, { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
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

interface ClearCookieProps { res: ServerResponse, cookieName: string }

export function clearAuthCookie ({ res, cookieName }: ClearCookieProps) {
  res.setHeader('Set-Cookie', cookie.serialize(cookieName, '', {
    ...cookieDefaults,
    maxAge: 0,
  }));
}

interface GetCookieValueProps { req: IncomingMessage, name: string  }

export function getCookieValue ({ req, name }: GetCookieValueProps): string | undefined {
  console.log('GETTING ACCESS TOOKEN', name);
  const cookieHeader = req.headers.cookie;
  if ( cookieHeader ) {
    const cookies = parse(cookieHeader);
    return cookies[name];
  }

  return undefined;
}
