import { AnyRoute, useLoaderData } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { GetNewVerificationEmail } from "./GetNewVerificationEmail";

export function VerifyAccount<TRoute extends AnyRoute> () {
  const { userId, tokenExpired } = useLoaderData<TRoute>({ 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from: ROUTE_URLS.verifyAccount as any 
  });

  if ( !userId ) {
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
