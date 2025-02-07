import { trpcService } from "../../../../trpcService/trpcClientService";
import { useTokenParamVerification } from "../../../../utils/useTokenParamVerification";
import { ResetPasswordForm } from "./ResetPasswordForm";


export function VerifyPasswordResetToken () {
  const { tokenExpired, userId, isLoading } = useTokenParamVerification({
    verifyTokenProcedure: trpcService.auth.verifyPasswordResetToken,
    onVerificationSuccess: async () => {
    } 
  });

  // console.log('foooosh', { tokenExpired, userId, isLoading });

  if ( isLoading ) {
    return <>Verifying...</>
  }

  if ( userId && tokenExpired ) {
    console.log('floooooop');
    // TODO: add better handler 
    return <>Token expired</>
  }

  if ( userId ) {
    return <ResetPasswordForm userId={userId} />
  }

  // TODO: what do we do here, should this ever return? 
  return <></>;
}