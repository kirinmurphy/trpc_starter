import { useContext } from "react";
import { UserContext } from "./UserContext";

export function AuthenticatedHomepage () {  
  const user = useContext(UserContext);

  // cy.log('[AUTH_HOME] User context:', user, new Date().toISOString());
  
  return (
    <>
      <header>
        Welcome back, {user.name}
      </header>
    </>
  )
}
