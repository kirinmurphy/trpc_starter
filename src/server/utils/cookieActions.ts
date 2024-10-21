import { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';

// interface SetCookieProps {
//   res: ServerResponse;
//   token: string;
//   name: string;
//   maxAge: number;
// }

// export function setAuthCookie (props: SetCookieProps): void {
//   const { res, token, name, maxAge } = props;
//   const cookieString = cookie.serialize(name, token, { ...cookieDefaults, maxAge });  
//   const existingCookies = res.getHeader('Set-Cookie') || [];
//   const newCookies = Array.isArray(existingCookies)
//     ? [...existingCookies, cookieString]
//     : [existingCookies.toString(), cookieString];
//   res.setHeader('Set-Cookie', newCookies);
// }

interface GetCookieValueProps { req: IncomingMessage, name: string  }

export function getCookieValue ({ req, name }: GetCookieValueProps): string | undefined {
  const cookieHeader = req.headers.cookie;
  if ( cookieHeader ) {
    const cookies = parse(cookieHeader);
    return cookies[name];
  }

  return undefined;
}

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
} as const;

export function clearCookie ({ res, cookieName }: { res: ServerResponse; cookieName: string; }) {
  res.setHeader(
    "Set-Cookie",
    `${cookieName}=; ${Object.entries({ ...cookieDefaults, expires: new Date(0) })
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")}`
  );
}

export function setCookie ({ res, value, cookieName }: { res: ServerResponse; value: string; cookieName: string;  }) {
  res.setHeader(
    "Set-Cookie",
    `${cookieName}=${value}; ${Object.entries(cookieDefaults)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")}`
  );
}
