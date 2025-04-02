import { z } from 'zod';

import { router, procedures } from '../trpcRouter';
import { loginUserMutation, loginUserSchema } from './login/loginUserMutation';
import { logoutUserMutation } from './logout/logoutUserMutation';
import { getUserQuery } from './getUserQuery';
import { refreshTokenMutation } from './refreshTokenMutation';
import {
  createAccountMutation,
  createAccountSchema,
} from './createAccount/createAccountMutation';
import { verifyAccountMutation } from './createAccount/verifyAccountMutation';
import {
  getNewVerificationEmailMutation,
  GetNewVerificationEmailSchema,
} from './createAccount/getNewVerificationEmailMutation';
import {
  resendFailedVerificationEmailMutation,
  ResendFailedVerificationEmailSchema,
} from './createAccount/resendFailedVerificationEmailMutation';
import {
  getVerificationEmailSentStatusQuery,
  GetVerificationEmailSentStatusSchema,
} from './createAccount/getVerificationEmailSentStatusQuery';
import {
  requestResetPasswordEmailMutation,
  RequestResetPasswordEmailSchema,
} from './resetPassword/requestResetPasswordEmailMutation';
import {
  resetPasswordMutation,
  ResetPasswordSchema,
} from './resetPassword/resetPasswordMutation';
import { verifyPasswordResetTokenMutation } from './resetPassword/verifyPasswordResetTokenMutation';
import { autoLoginDevSuperAdminMutation } from './login/autoLoginDevSuperAdminMutation';
import { getAppStateQuery } from './getAppStateQuery';
import {
  superAdminSetupMutation,
  SuperAdminSetupSchema,
} from './superAdminSetup/superAdminSetupMutation';
import { verifySuperAdminSetupTokenMutation } from './superAdminSetup/verifySuperAdminSetupTokenMutation';

const { publicQuery, protectedQuery, publicMutation } = procedures;

export const authRouter = router({
  // -- Account creation
  createAccount: publicMutation
    .input(createAccountSchema)
    .mutation(createAccountMutation),

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

  // -- Authentication
  getAppState: publicQuery.query(getAppStateQuery),

  login: publicMutation.input(loginUserSchema).mutation(loginUserMutation),

  autoLoginDevSuperAdmin: publicMutation.mutation(
    autoLoginDevSuperAdminMutation
  ),

  logout: publicMutation.mutation(logoutUserMutation),

  refreshToken: publicMutation.mutation(refreshTokenMutation),

  getUser: protectedQuery.query(getUserQuery),

  // -- Reset Password
  requestResetPasswordEmail: publicMutation
    .input(RequestResetPasswordEmailSchema)
    .mutation(requestResetPasswordEmailMutation),

  verifyPasswordResetToken: publicMutation
    .input(z.object({ token: z.string() }))
    .mutation(verifyPasswordResetTokenMutation),

  resetPassword: publicMutation
    .input(ResetPasswordSchema)
    .mutation(resetPasswordMutation),

  // -- Super Admin Setup
  superAdminSetup: protectedQuery
    .input(SuperAdminSetupSchema)
    .mutation(superAdminSetupMutation),

  verifySuperAdminSetupToken: publicMutation
    .input(z.object({ token: z.string() }))
    .mutation(verifySuperAdminSetupTokenMutation),
});
