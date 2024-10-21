import { trpcService } from "../../../utils/trpc"
import { handleInvalidRefreshToken } from "../../routing/handleInvalidRefreshToken";
import { ROUTE_URLS } from "../../routing/routeUrls";

export function AuthenticatedHomepage () {  
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
    <>
      <header>
        <h1>Welcome guy</h1>
        <button onClick={handleLogout}>Logout</button>            
      </header>
    </>
  )
}
