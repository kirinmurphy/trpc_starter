import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { trpcService } from "../../../trpcService/trpcClientService";
import { ROUTE_URLS } from "../../../routing/routeUrls";
import { ResendVerificationEmail } from "./ResendVerificationEmail";

export function VerifyAccount () {
  const router = useRouter();
  const token = router.state.location.search.token;
  const navigate = useNavigate();
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);

  if ( !token ) {
    navigate({ to: ROUTE_URLS.login });
  }

  const { data, isLoading } = trpcService.auth.verifyAccount.useQuery({ token }, {
    retry: false,
    enabled: Boolean(token),
    onSuccess: (data) => {
      if ( data?.success ) {
        navigate({ to: ROUTE_URLS.authenticatedHomepage })
      }

      if ( data?.error ) {
        console.log('Data errr', data.error);
        if ( data?.error === 'account_verification_token_expired' ) {
          setTokenExpired(true);
        }
      }

      console.log('DATAAAAA', data);
      if ( data && !data?.userId ) {
        navigate({ to: ROUTE_URLS.login });
      }
    }
  })

  const userId = data?.userId?.toString();
  
  if ( isLoading ) {
    return <>Verifying...</>;
  }

  if ( userId && tokenExpired ) {
    return <ResendVerificationEmail userId={userId} /> 
  }

  return (
    <>Success! Redirecting...</>
  );
}
