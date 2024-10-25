import { createContext } from "react";

interface UserContextProps {
  email: string | null; 
  name: string | null;
}

export const UserContext = createContext<UserContextProps | null>({ email: null, name: null });
