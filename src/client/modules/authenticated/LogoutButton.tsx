import { clearAuthQueries } from "../../trpcService/invalidateQueries";
import { trpcService } from "../../trpcService/trpcClientService"
import { ROUTE_URLS } from "../../routing/routeUrls";
import { csrfStore } from "../../trpcService/createHttpLink";

export function LogoutButton () {
  const logoutMutation = trpcService.auth.logout.useMutation({
    onSuccess: async data => {
      if ( data.success ) { 
        await clearAuthQueries();
        csrfStore.clearToken();
        window.location.href = ROUTE_URLS.publicHomepage;
      }
    }    
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutate();
    } catch (error) {
      console.error("Error during logout:", error);
    } 
  };

  return (
    <button onClick={handleLogout}>Logout</button>            
  );
}
