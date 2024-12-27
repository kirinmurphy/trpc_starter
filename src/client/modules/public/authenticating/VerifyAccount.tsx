import { useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { trpcService } from "../../../trpcService/trpcClientService";
import { ROUTE_URLS } from "../../../routing/routeUrls";
import { ResendVerificationEmail } from "./ResendVerificationEmail";

const loginRedirectConfig = {
  to: ROUTE_URLS.login,   
  search: { notification: 'verification_failed' }
};

export function VerifyAccount () {
  const router = useRouter();
  const token = router.state.location.search.token;
  const navigate = useNavigate();
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  const { mutate, data, isLoading } = trpcService.auth.verifyAccount.useMutation({
    onSuccess: (data) => {      
      if ( data?.success ) {
        navigate({ to: ROUTE_URLS.authenticatedHomepage })
      }
      
      if ( data?.error ) {
        console.log('Data errr', data.error);
        if ( data?.error === 'account_verification_token_expired' ) {
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
    return <ResendVerificationEmail 
      userId={userId} 
      viewType="confirmedExpired" 
    />;
  }

  return (
    <>Account verified! Redirecting...</>
  );
}
