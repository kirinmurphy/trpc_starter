import { trpcService } from "../../../utils/trpc"
import { handleInvalidRefreshToken } from "../../routing/handleInvalidRefreshToken";
import { ROUTE_URLS } from "../../routing/routeUrls";

export function LogoutButton () {
  const logoutMutation = trpcService.auth.logout.useMutation({
    onSuccess: async data => {
      if ( data.success ) { await handleInvalidRefreshToken(); }
    }    
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = ROUTE_URLS.publicHomepage;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>            
  );
}
