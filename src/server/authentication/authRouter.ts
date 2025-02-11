import { z } from "zod";

import { router, procedures } from "../trpcRouter";
import { loginUserMutation, loginUserSchema } from "./login/loginUserMutation";
import { logoutUserMutation } from "./logout/logoutUserMutation";
import { getUserQuery } from "./getUserQuery";
import { refreshTokenMutation } from "./refreshTokenMutation";
import { createAccountMutation, createAccountSchema } from "./createAccount/createAccountMutation";
import { verifyAccountMutation } from "./createAccount/verifyAccountMutation";
import { getNewVerificationEmailMutation, GetNewVerificationEmailSchema } from "./createAccount/getNewVerificationEmailMutation";
import { resendFailedVerificationEmailMutation, ResendFailedVerificationEmailSchema } from "./createAccount/resendFailedVerificationEmailMutation";
import { getVerificationEmailSentStatusQuery, GetVerificationEmailSentStatusSchema } from "./createAccount/getVerificationEmailSentStatusQuery";
import { requestResetPasswordEmailMutation, RequestResetPasswordEmailSchema } from "./resetPassword/requestResetPasswordEmailMutation";
import { resetPasswordMutation, ResetPasswordSchema } from "./resetPassword/resetPasswordMutation";
import { verifyPasswordResetTokenMutation } from "./resetPassword/verifyPasswordResetTokenMutation";

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

  getNewVerificationEmail: publicMutation
    .input(GetNewVerificationEmailSchema)
    .mutation(getNewVerificationEmailMutation),

  getVerificationEmailSentStatus: publicQuery
    .input(GetVerificationEmailSentStatusSchema)
    .query(getVerificationEmailSentStatusQuery),  

  resendFailedVerificationEmail: publicMutation
    .input(ResendFailedVerificationEmailSchema)
    .mutation(resendFailedVerificationEmailMutation),

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

  // -- Reset Password
  requestResetPasswordEmail: publicMutation
    .input(RequestResetPasswordEmailSchema)
    .mutation(requestResetPasswordEmailMutation),

  verifyPasswordResetToken: publicMutation
    .input(z.object({ token: z.string() }))
    .mutation(verifyPasswordResetTokenMutation),

  resetPassword: publicMutation
    .input(ResetPasswordSchema)
    .mutation(resetPasswordMutation)
});  
