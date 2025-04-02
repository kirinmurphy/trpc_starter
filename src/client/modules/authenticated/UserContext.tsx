import { createContext } from 'react';

interface UserContextProps {
  email: string | null;
  username: string | null;
  verified: boolean;
}

export const UserContext = createContext<UserContextProps>({
  email: null,
  username: null,
  verified: false,
});
