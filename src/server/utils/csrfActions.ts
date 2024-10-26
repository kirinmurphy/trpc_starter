import { randomBytes } from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { clearCookie, getCookieValue, setCookie } from './cookieActions';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_EXPIRY_HOURS = 24;

export function generateCsrfToken (): string {
  return randomBytes(32).toString('hex');
}

interface RequestActionProps {
  req: IncomingMessage;
}

interface SetCsrfTokenProps {
  res: ServerResponse;
  token: string;
}

export function setCsrfToken ({ res, token }: SetCsrfTokenProps): void {
  const expires = new Date(); 
  expires.setHours(expires.getHours() + CSRF_EXPIRY_HOURS); 
  setCookie({ res, name: CSRF_COOKIE_NAME, value: token, expires });
  res.setHeader('x-csrf-token', token);
}

export function getCsrfToken ({ req }: RequestActionProps): string | undefined {
  return getCookieValue({ req, name: CSRF_COOKIE_NAME });
}

export function clearCsrfToken ({ res }: { res: ServerResponse }): void {
  clearCookie({ res, name: CSRF_COOKIE_NAME });
}

export function validateCsrfToken ({ req }: RequestActionProps): boolean {
  if ( req.method === 'GET' ) { return true; }

  const cookieToken = getCsrfToken({ req });
  const headerToken = req.headers['x-csrf-token'];
  if ( !cookieToken || !headerToken ) { return false; }
  const headerTokenMatcher = Array.isArray(headerToken) ? headerToken[0] : headerToken;
  return cookieToken === headerTokenMatcher;
}
