import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { validateUserAuthQuery } from "./validateUserAuthQuery";
import { ContextType } from "./types";

export async function createContext(options: CreateNextContextOptions): Promise<ContextType> {
  const { req, res } = options;
  const userResult = await validateUserAuthQuery({ req, res });
  return {
    req,
    res,
    user: userResult.isAuthenticated ? userResult.user : null
  }
}
