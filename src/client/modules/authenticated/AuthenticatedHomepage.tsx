import { useContext } from "react";
import { UserContext } from "./UserContext";

export function AuthenticatedHomepage () {  
  const user = useContext(UserContext);

  return (
    <>
      <header>
        Welcome back, {user?.name}
      </header>
    </>
  )
}
