import { createContext } from 'react';

interface UserContextProps {
  email: string | null;
  userName: string | null;
  verified: boolean;
}

export const UserContext = createContext<UserContextProps>({
  email: null,
  userName: null,
  verified: false,
});
