import { trpcService } from "../../../utils/trpcClients"
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
      console.log('---------------------- logging out');
      await logoutMutation.mutate();
      console.log('---------------------- logged out');
      window.location.href = ROUTE_URLS.publicHomepage;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>            
  );
}
