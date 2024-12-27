import { Link } from "@tanstack/react-router";
import { trpcService } from "../../trpcService/trpcClientService";
import { ROUTE_URLS } from "../../routing/routeUrls";
import { LogoutButton } from "./LogoutButton";
import { UserContext } from "./UserContext";

interface AuthenticatedAppProps {
  children: React.ReactNode;
}

export function AuthenticatedApp ({ children }: AuthenticatedAppProps) {
  const { data:user } = trpcService.auth.getUser.useQuery(undefined, {
    staleTime: 30*60*1000,
    cacheTime: 60*60*1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onError: (err: unknown) => {
      console.error('failed to fetch user', err);
    }
  });  
  
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
        <main>
          {children}
        </main>
      </UserContext.Provider>
    </>
  ); 
}
