import { z } from "zod";

import { router, procedures } from "../trpcRouter";
import { loginUserMutation, loginUserSchema } from "./login/loginUserMutation";
import { logoutUserMutation } from "./logout/logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";
import { registerUserMutation, registerUserSchema } from "./register/registerUserMutation";
import { verifyAccountMutation } from "./register/verifyAccountMutation";
import { resendVerificationEmailMutation, ResendVerificationEmailSchema } from "./register/resendVerificationEmailMutation";

const { publicQuery, protectedQuery, publicMutation } = procedures;

export const authRouter = router({
  signUp: publicMutation
    .input(registerUserSchema)
    .mutation(registerUserMutation),

  login: publicMutation
    .input(loginUserSchema)
    .mutation(loginUserMutation),

  verifyAccount: publicMutation
    .input(z.object({ token: z.string() }))
    .mutation(verifyAccountMutation),

  resendVerificationEmail: publicMutation
    .input(ResendVerificationEmailSchema)
    .mutation(resendVerificationEmailMutation),

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
