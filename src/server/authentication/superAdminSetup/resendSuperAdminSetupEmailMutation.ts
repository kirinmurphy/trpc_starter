import { sendSuperAdminSetupEmail } from '../../../../docker/admin-setup/utils/sendSuperAdminSetupEmail';
import { requestResetPasswordEmailAction } from '../resetPassword/requestResetPasswordEmailAction';

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

export async function resendSuperAdminSetupEmailMutation() {
  console.log('allrighhhhht');
  if (!superAdminEmail) {
    // TODO: this is quicker, but email should already be in the DB, should we use that
    throw new Error('SUPER_ADMIN_EMAIL is required');
  }

  return requestResetPasswordEmailAction({
    email: superAdminEmail,
    sendVerificationEmailAction: sendSuperAdminSetupEmail,
  });
}
