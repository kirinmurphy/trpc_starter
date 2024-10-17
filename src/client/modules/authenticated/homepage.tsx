import React from "react";
import { trpcService } from "../../../utils/trpc"
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../routing/routeUrls";
import { useQueryClient } from "@tanstack/react-query";
import { handleInvalidRefreshToken } from "../../routing/isAuthenticated";

export function Homepage () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = trpcService.auth.logout.useMutation({
    onSuccess: async data => {
      if ( data.success ) {
        handleInvalidRefreshToken();
        queryClient.removeQueries();
        navigate({ to: ROUTE_URLS.publicHomepage });
      }
    }    
  });

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
    logoutMutation.mutate();
  }
  return (
    <>
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button>    
    </>
  )
}
