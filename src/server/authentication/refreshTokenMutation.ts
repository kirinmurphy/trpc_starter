import { AUTH_STATUSES, ContextType } from "./types";
import { 
  clearAccessTokenCookie, 
  clearRefreshTokenCookie, 
  decodeRefreshTokenCookie, 
  getRefreshTokenCookie, 
  setAccessTokenCookie, 
  setRefreshTokenCookie 
} from "./jwtActions";
import { throwAuthError } from "../router";

export async function refreshTokenMutation ({ ctx }: { ctx: ContextType }) {
  const { req, res } = ctx;
  
  const refreshToken = getRefreshTokenCookie({ req });

  if (!refreshToken ) {
    throwAuthError(AUTH_STATUSES.noRefreshToken);
    return;
  }

  try {
    const { userId } = decodeRefreshTokenCookie({ refreshToken });
    
    // check revoked/blacklisted token

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
