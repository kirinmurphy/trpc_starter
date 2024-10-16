import cookie from 'cookie';
import { COOKIE_NAME } from "./constants";
import { ServerResponse } from 'http';

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
} as const;

export function setAuthCookie (res: ServerResponse, token: string) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, token, {
    ...cookieDefaults,
    maxAge: 86400,
  }));
}

export function clearAuthCookie (res: ServerResponse) {
  res.setHeader('Set-Cookie', cookie.serialize(COOKIE_NAME, '', {
    ...cookieDefaults,
    maxAge: 0,
  }));
}