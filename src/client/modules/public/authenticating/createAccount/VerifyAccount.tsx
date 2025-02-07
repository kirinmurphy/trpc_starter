import { useNavigate } from "@tanstack/react-router";
import { trpcService } from "../../../../trpcService/trpcClientService";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { GetNewVerificationEmail } from "./GetNewVerificationEmail";
import { invalidateAuthCheckQuery } from "../../../../trpcService/invalidateQueries";
import { useTokenParamVerification } from "../../../../utils/useTokenParamVerification";

export function VerifyAccount () {
  const navigate = useNavigate();
  const { tokenExpired, userId, isLoading } = useTokenParamVerification({
    verifyTokenProcedure: trpcService.auth.verifyAccount,
    onVerificationSuccess: async () => {
      await invalidateAuthCheckQuery();
      navigate({ to: ROUTE_URLS.authenticatedHomepage });
    } 
  })
    
  if ( isLoading ) {
    return <>Verifying...</>;
  }

  if ( userId && tokenExpired ) {
    return <GetNewVerificationEmail 
      userId={userId} 
      viewType="confirmedExpired" 
    />;
  }

  return (
    <>Account verified! Redirecting...</>
  );
}
