import { clearAccessTokenCookie, clearRefreshTokenCookie } from "../jwtActions";
import { ContextType, SimpleMutationReturnType } from "../types";

interface LogoutMutationType { 
  ctx: ContextType 
}

export function logoutUserMutation (props: LogoutMutationType): SimpleMutationReturnType {
  const { ctx: { res } } = props;
  clearAccessTokenCookie({ res });
  clearRefreshTokenCookie({ res });
  return { success: true, message: "Logged out successfully" };
}
