import { useContext } from "react";
import { UserContext } from "./UserContext";

export function AuthenticatedHomepage () {  
  const user = useContext(UserContext);

  if ( !user ) {
    return <>No user?  why? </>
  }

  return (
    <>
      <header>
        Welcome back, {user.name} <br/>
        Verified: {user.verified.toString()} 
      </header>
    </>
  )
}
