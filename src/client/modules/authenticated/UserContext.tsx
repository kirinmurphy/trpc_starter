import { createContext } from "react";

interface UserContextProps {
  email: string | null; 
  name: string | null;
  verified: boolean;
}

export const UserContext = createContext<UserContextProps | null>({ 
  email: null, 
  name: null, 
  verified: false 
});
