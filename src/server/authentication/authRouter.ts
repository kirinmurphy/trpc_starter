
import { router, publicProcedure, protectedProcedure } from "../trpcRouter";
import { loginUserMutation, loginUserSchema } from "./loginUserMutation";
import { logoutUserMutation } from "./logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";
import { registerUserMutation, registerUserSchema } from "./registerUserMutation";

export const authRouter = router({
  signUp: publicProcedure
    .input(registerUserSchema)
    .mutation(registerUserMutation),

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
    
  refreshToken: publicProcedure
    .mutation(refreshTokenMutation),    

  getUser: protectedProcedure  
    .query(getUserQuery),
});  
