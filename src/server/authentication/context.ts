import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { validateUserAuthQuery } from "./validateUserAuthQuery";
import { ContextType } from "./types";

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;

  const authResult = await validateUserAuthQuery({ req, res });
  
  const user = authResult.isAuthenticated ? authResult.user : null;  

  
  return { 
    req, 
    res, 
    user, 
  };
}
