import { ACCESS_COOKIE_NAME } from "./jwtCookieNames";
import { ContextType } from "./types";

const cookieDefaults = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
} as const;

export function logoutUserMutation ({ ctx }: { ctx: ContextType }): { success: boolean; message: string; } {
  const { res } = ctx;

  res.setHeader(
    "Set-Cookie",
    `${ACCESS_COOKIE_NAME}=; ${Object.entries({...cookieDefaults, expires: new Date(0)})
      .map(([key, value]) => `${key}=${value}`)
      .join("; ")}`
  );

  return { success: true, message: "Logged out successfully" };
}