
// import jwt from "jsonwebtoken";
// import { z } from "zod";
import { router, publicProcedure } from "../router";
import { loginUserMutation, loginUserSchema } from "./loginUserMutation";
import { logoutUserMutation } from "./logoutUserMutation";


export const authRouter = router({
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  logout: publicProcedure
    .mutation(logoutUserMutation),

  isAuthenticated: publicProcedure 
    .query(({ ctx: { userId } }) => ({ 
      isAuthenticated: !!userId,
      userId 
    })),
});
