import cookie, { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';

interface GetCookieValueProps {
  req: IncomingMessage;
  name: string;
}

export function getCookieValue({
  req,
  name,
}: GetCookieValueProps): string | undefined {
  const cookieHeader = req.headers.cookie;
  return cookieHeader ? parse(cookieHeader)[name] : undefined;
}

const cookieDefaults = {
  httpOnly: true,
  // secure: process.env.NODE_ENV === 'production',
  secure: false,
  sameSite: 'strict',
  path: '/',
} as const;

interface SetCookieValueProps {
  res: ServerResponse;
  value: string;
  name: string;
  expires: Date;
}

export function setCookie(props: SetCookieValueProps) {
  const { res, value, name, expires } = props;
  const cookieString = cookie.serialize(name, value, {
    ...cookieDefaults,
    expires,
  });
  const existingCookies = res.getHeader('Set-Cookie') || [];
  const newCookies = Array.isArray(existingCookies)
    ? [...existingCookies, cookieString]
    : [existingCookies.toString(), cookieString];
  res.setHeader('Set-Cookie', newCookies);
}

type ClearCookievalueProps = Pick<SetCookieValueProps, 'res' | 'name'>;

export function clearCookie({ res, name }: ClearCookievalueProps) {
  setCookie({ res, name, value: '', expires: new Date(0) });
}
