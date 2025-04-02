import { ROUTE_URLS } from '../../../src/client/routing/routeUrls';
import { sendEmail } from '../../../src/server/email/sendEmail';
import { getVerificationUrl } from '../../../src/server/authentication/utils/getVerificationUrl';

const websiteDomain = process.env.WEBSITE_DOMAIN;

interface SendSuperAdminSetupEmailProps {
  to: string;
  verificationToken: string;
}

export async function sendSuperAdminSetupEmail(
  props: SendSuperAdminSetupEmailProps
) {
  const { to, verificationToken } = props;

  const adminAccountCreationUrl = getVerificationUrl({
    verificationToken,
    route: ROUTE_URLS.resetPassword,
    addlParams: ['type=superAdminCreation'],
  });

  return sendEmail({
    to,
    subject: `Welcome!  Create your admin account for ${websiteDomain}`,
    emailTemplate: `
      <h1>Welcome!</h1>
      <p>Your website is almost ready for launch!</p> 
      <p>Please complete your account setup by setting your password using the link below:</p>
      <a href="${adminAccountCreationUrl}">Complete Setup</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${adminAccountCreationUrl}</p>
      <p>This link will expire in 48 hours.</p>
      <p>If you did not request this setup, please ignore this email.</p>
    `,
  });
}
