import { Link } from "@tanstack/react-router";
import { trpcService } from "../../../utils/trpcClients";
import { ROUTE_URLS } from "../../routing/routeUrls";
import { LogoutButton } from "./LogoutButton";
import { UserContext } from "./UserContext";

interface AuthenticatedAppProps {
  children: React.ReactNode;
}

export function AuthenticatedApp ({ children }: AuthenticatedAppProps) {
  const { data:user } = trpcService.auth.getUser.useQuery();  
  
  if ( !user ) { return <></>; }  

  return (
    <>
      <header className="flex pb-4 mb-8 border-b">
        <div className="flex-grow">
          <Link to={ROUTE_URLS.publicHomepage} preload={false}>Home</Link>
        </div>
        
        <div className="flex flex-col items-end">
          <div>{user.email}</div>
          <LogoutButton />        
        </div>
      </header>

      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
    </>
  ); 
}
