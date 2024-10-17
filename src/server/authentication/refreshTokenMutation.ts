import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { ContextType } from "./types";
import { JWT_SECRET, REFRESH_JWT_SECRET } from "./constants";
import { clearAuthCookie, setAuthCookie } from "./cookieActions";

export async function refreshTokenMutation ({ ctx }: { ctx: ContextType }) {
  const refreshToken = ctx.req.cookies['refresh_token'];

  if (!refreshToken ) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No refresh token'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_JWT_SECRET) as { userId: number }
    // check revoked/blacklisted token

    const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '15m' });
    setAuthCookie(ctx.res, newAccessToken);

    return {
      success: true, 
      message: 'Token refreshed successfully'
    };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    clearAuthCookie(ctx.res);
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired refresh token'
    });
  }
}