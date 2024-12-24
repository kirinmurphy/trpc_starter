import { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { trpcService } from "../../../trpcService/trpcClientService";
import { ROUTE_URLS } from "../../../routing/routeUrls";

export function VerifyAccount () {
  const router = useRouter();
  const token = router.state.location.search.token;

  const navigate = useNavigate();

  const { data, isLoading } = trpcService.auth.verifyAccount.useQuery({ token })

  useEffect(() => {
    if ( !token ) {
      navigate({ to: ROUTE_URLS.login });
    }
    
    if ( data?.success ) {
      console.log('SUCCEEEEESSSS!!!!');
      navigate({ to: ROUTE_URLS.authenticatedHomepage })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, data]);
  
  if ( isLoading ) {
    return <>Verifying...</>;
  }

  return (
    <>Success! Redirecting...</>
  );
}
