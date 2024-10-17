import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { validateUserAuthQuery } from "./validateUserAuthQuery";
import { ContextType } from "./types";

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;
  console.log('Creating context, request path:', req.url);
  const userResult = await validateUserAuthQuery({ req, res });
  console.log('Context creation result:', {
    isAuthenticated: userResult.isAuthenticated,
    userId: userResult.user?.id
  });
  
  return {
    req,
    res,
    user: userResult.isAuthenticated ? userResult.user : null
  }
}
