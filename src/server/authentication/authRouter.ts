
import { router, procedures } from "../trpcRouter";
import { loginUserMutation, loginUserSchema } from "./login/loginUserMutation";
import { logoutUserMutation } from "./logout/logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";
import { registerUserMutation, registerUserSchema } from "./register/registerUserMutation";
import { verifyAccountQuery } from "./register/verifyAccountQuery";
import { z } from "zod";

const { publicQuery,  protectedQuery,  publicMutation } = procedures;

export const authRouter = router({
  signUp: publicMutation
    .input(registerUserSchema)
    .mutation(registerUserMutation),

  login: publicMutation
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  verifyAccount: publicQuery
    .input(z.object({ token: z.string() }))
    .query(({ input: { token }, ctx }) => {
      return verifyAccountQuery({ ctx, token });
    }),

  logout: publicMutation  
    .mutation(logoutUserMutation),

  isAuthenticated: publicQuery   
    .query(({ ctx: { userId } }) => ({
      isAuthenticated: !!userId,
      userId
    })),  
    
  refreshToken: publicMutation
    .mutation(refreshTokenMutation),    

  getUser: protectedQuery  
    .query(getUserQuery),
});  
