import { useNavigate } from "@tanstack/react-router";
import { trpcService } from "../../../../trpcService/trpcClientService";
import { useTokenParamVerification } from "../../../../utils/useTokenParamVerification";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { ERR_VERIFICATION_TOKEN_EXPIRED } from "../../../../../utils/messageCodes";


export function VerifyPasswordResetToken () {
  const navigate = useNavigate();
  const { tokenExpired, userId, isLoading } = useTokenParamVerification({
    verificationType: 'password',
    verifyTokenProcedure: trpcService.auth.verifyPasswordResetToken,
    onVerificationExpired: async () => {
      navigate({
        to: ROUTE_URLS.requestResetPasswordEmail,
        search: { notification: ERR_VERIFICATION_TOKEN_EXPIRED }
      })
    }
  });

  if ( isLoading ) {
    return <>Verifying...</>
  }
 
  if ( userId && !tokenExpired ) {
    return <ResetPasswordForm userId={userId} />
  }

  // TODO: what do we do here, should this ever return? 
  return <></>;
}