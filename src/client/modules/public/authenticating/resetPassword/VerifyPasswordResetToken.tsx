import { AnyRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { ERR_VERIFICATION_TOKEN_EXPIRED } from "../../../../../utils/messageCodes";
import { useEffect } from "react";


export function VerifyPasswordResetToken<TRoute extends AnyRoute>() {
  const navigate = useNavigate();
  const { userId, tokenExpired } = useLoaderData<TRoute>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    from: ROUTE_URLS.resetPassword as any
  });
  
  useEffect(() => {
    if ( tokenExpired ) {
      navigate({
        to: ROUTE_URLS.requestResetPasswordEmail,
        search: { notification: ERR_VERIFICATION_TOKEN_EXPIRED }
      });
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenExpired]);

  if ( !userId ) {
    return <>Verifying...</>
  }
 
  if ( userId && !tokenExpired ) {
    return <ResetPasswordForm userId={userId} />
  }

  // TODO: what do we do here, should this ever return? 
  return <></>;
}