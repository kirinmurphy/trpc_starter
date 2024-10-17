import React from "react";
import { trpcService } from "../../../utils/trpc"
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../routing/routeUrls";
import { handleInvalidRefreshToken } from "../../routing/isAuthenticated";
// import AuthTestComponent from "./AuthTest";

export function Homepage () {
  const navigate = useNavigate();

  const logoutMutation = trpcService.auth.logout.useMutation({
    onSuccess: async data => {
      if ( data.success ) {
        await handleInvalidRefreshToken();
        setTimeout(() => {
          navigate({ to: ROUTE_URLS.publicHomepage });

        }, 1000);
      }
    }    
  });

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
    logoutMutation.mutate();
  };

  return (
    <>
      <header>
        <h1>Home</h1>
        <button onClick={handleLogout}>Logout</button>            
      </header>

      {/* <AuthTestComponent /> */}
    </>
  )
}
