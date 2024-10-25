import { clearAuthQueries } from "../../../utils/invalidateQueries";
import { trpcService } from "../../../utils/trpcClients"
import { ROUTE_URLS } from "../../routing/routeUrls";

export function LogoutButton () {
  const logoutMutation = trpcService.auth.logout.useMutation({
    onSuccess: async data => {
      if ( data.success ) { await clearAuthQueries(); }
    }    
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutate();
      window.location.href = ROUTE_URLS.publicHomepage;
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>            
  );
}
