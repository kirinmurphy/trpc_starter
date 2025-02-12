import { ROUTE_URLS } from '../../../client/routing/routeUrls';
import { sendEmail } from '../../email/sendEmail';
import { SendVerificationEmailProps } from '../createAccount/sendAccountVerificationEmail';
import { getVerificationUrl } from '../utils/getVerificationUrl';

export async function sendResetPasswordEmail(
  props: SendVerificationEmailProps
) {
  const { to, verificationToken } = props;

  const passwordResetUrl = getVerificationUrl({
    verificationToken,
    route: ROUTE_URLS.resetPassword,
  });

  return sendEmail({
    to,
    subject: 'Reset your password',
    emailTemplate: `
      <h1>Reset Your Password</h1>
      <p>A password reset request was made for ${to}.</p>
      <a href="${passwordResetUrl}">Reset password</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${passwordResetUrl}</p>
    `,
  });
}
