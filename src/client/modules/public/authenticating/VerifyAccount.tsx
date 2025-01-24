import { useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ERR_ACCOUNT_VERIFICATION_TOKEN_EXPIRED, ERR_VERIFICATION_FAILED } from "../../../../utils/messageCodes";
import { trpcService } from "../../../trpcService/trpcClientService";
import { ROUTE_URLS } from "../../../routing/routeUrls";
import { GetNewVerificationEmail } from "./GetNewVerificationEmail";
import { invalidateAuthCheckQuery } from "../../../trpcService/invalidateQueries";

const loginRedirectConfig = {
  to: ROUTE_URLS.login,   
  search: { notification: ERR_VERIFICATION_FAILED }
};

export function VerifyAccount () {
  const router = useRouter();
  const token = router.state.location.search.token;
  const navigate = useNavigate();
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  const { mutate, data, isLoading } = trpcService.auth.verifyAccount.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await invalidateAuthCheckQuery();
        navigate({ to: ROUTE_URLS.authenticatedHomepage });
        return;
      }
      
      if ( data?.error ) {
        if ( data?.error === ERR_ACCOUNT_VERIFICATION_TOKEN_EXPIRED ) {
          setTokenExpired(true);
        } else {
          navigate(loginRedirectConfig);
        }
      }
    },
    onError: (err) => {
      console.error('Verification error', err);
      navigate(loginRedirectConfig);
    }
  })

  useEffect(() => {    
    if ( !token ) { navigate(loginRedirectConfig); return; }
    mutate({ token });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const userId = data?.userId?.toString();
  
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
