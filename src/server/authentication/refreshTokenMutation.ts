import { AUTH_ERROR_MESSAGES, AUTH_STATUSES, ContextType } from "./types";
import { throwAuthError } from "./throwAuthError";
import { 
  clearAccessTokenCookie, 
  clearRefreshTokenCookie, 
  decodeRefreshTokenCookie, 
  getRefreshTokenCookie, 
  setAccessTokenCookie, 
  setRefreshTokenCookie 
} from "./jwtActions";

export async function refreshTokenMutation ({ ctx }: { ctx: ContextType }) {
  const { req, res } = ctx;
  
  const refreshToken = getRefreshTokenCookie({ req });

  if (!refreshToken ) {
    return { 
      success: false,
      message: AUTH_ERROR_MESSAGES[AUTH_STATUSES.noRefreshToken]
    };
  }

  try {
    const { userId } = decodeRefreshTokenCookie({ refreshToken });
    
    // TODO: check revoked/blacklisted token

    setAccessTokenCookie({ res, userId });
    setRefreshTokenCookie({ res, userId });

    return {
      success: true, 
      message: 'Token refreshed successfully'
    };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    clearAccessTokenCookie({ res });
    clearRefreshTokenCookie({ res });
    throwAuthError(AUTH_STATUSES.invalidToken);
  }
}
