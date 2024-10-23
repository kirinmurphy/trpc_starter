import { trpcService } from "../../../utils/trpcClients";
import { LogoutButton } from "./LogoutButton";

interface AuthenticatedAppProps {
  children: React.ReactNode;
}

export function AuthenticatedApp ({ children }:  AuthenticatedAppProps) {
  const { data:user } = trpcService.auth.getUser.useQuery();  
return (
    <>
        <>
        {!!user && (
          <div>
            <div>{user.name}</div>
            <div>{user.email}</div>
          </div>
        )}
        <LogoutButton />        
      </>
    {children}
    </>
  ); 
}
