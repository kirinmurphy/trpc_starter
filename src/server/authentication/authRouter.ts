
import { router, publicProcedure, protectedProcedure } from "../router";
import { loginUserMutation, loginUserSchema } from "./loginUserMutation";
import { logoutUserMutation } from "./logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";

export const authRouter = router({
  login: publicProcedure
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  logout: publicProcedure
    .mutation(logoutUserMutation),

  getUser: protectedProcedure
    .query(getUserQuery),

  isAuthenticated: publicProcedure 
    .query(({ ctx: { userId } }) => ({
      isAuthenticated: !!userId,
      userId
    })),

  // register: publicProcedure
  //   .input(registerUserSchema)
  //   .mutation(registerUserMutation),

  refreshToken: publicProcedure
    .mutation(refreshTokenMutation),    
});
