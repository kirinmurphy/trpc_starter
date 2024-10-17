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

export function setAuthCookie (props: SetCookieProps) {
  const { res, token, name, maxAge } = props;
  const cookieString = cookie.serialize(name, token, { ...cookieDefaults, maxAge });  
  const existingCookies = res.getHeader('Set-Cookie') || [];
  const newCookies = Array.isArray(existingCookies)
    ? [...existingCookies, cookieString]
    : [existingCookies.toString(), cookieString];
  res.setHeader('Set-Cookie', newCookies);
}

export function clearAuthCookie ({ res, cookieName }: { res: ServerResponse, cookieName: string }) {
  res.setHeader('Set-Cookie', cookie.serialize(cookieName, '', {
    ...cookieDefaults,
    maxAge: 0,
  }));
}

interface GetCookieValueProps { req: IncomingMessage, name: string  }

export function getCookieValue ({ req, name }: GetCookieValueProps): string | undefined {
  console.log('GETTING ACCESS TOOKEN');
  const cookieHeader = req.headers.cookie;
  // console.log('name', name, 'cookieHeader', cookieHeader);
  if ( cookieHeader ) {
    const cookies = parse(cookieHeader);
    return cookies[name];
  }

  return undefined;
}