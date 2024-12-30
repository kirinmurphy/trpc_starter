import { z } from "zod";

import { router, procedures } from "../trpcRouter";
import { loginUserMutation, loginUserSchema } from "./login/loginUserMutation";
import { logoutUserMutation } from "./logout/logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";
import { createAccountMutation, createAccountSchema } from "./createAccount/createAccountMutation";
import { verifyAccountMutation } from "./createAccount/verifyAccountMutation";
import { resendVerificationEmailMutation, ResendVerificationEmailSchema } from "./createAccount/resendVerificationEmailMutation";

const { publicQuery, protectedQuery, publicMutation } = procedures;

export const authRouter = router({
  createAccount: publicMutation
    .input(createAccountSchema)
    .mutation(createAccountMutation),

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
