// docker/verify-email.ts
import { createSmtpEmailTransporter } from '../src/server/email/providers/smtp/createSmtpEmailTransporter';
import { EmailProviderTypes } from '../src/server/email/types';

const providerMap = {
  [EmailProviderTypes.SMTP]: async () => {
    const transporter = await createSmtpEmailTransporter();
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    transporter.close();
  },
  [EmailProviderTypes.SENDGRID]: async () =>
    await checkEmailApiConfig(EmailProviderTypes.SENDGRID),
  [EmailProviderTypes.RESEND]: async () =>
    await checkEmailApiConfig(EmailProviderTypes.RESEND),
};

async function verifyEmailConfiguration() {
  const customProvider =
    (process.env.CUSTOM_EMAIL_PROVIDER as EmailProviderTypes) ||
    EmailProviderTypes.SMTP;

  console.log(`Email verification using provider: ${customProvider}`);

  if (customProvider in providerMap) {
    await providerMap[customProvider]();
  } else {
    throw new Error(`❌ Unknown email provider: ${customProvider}`);
  }
}

if (require.main === module) {
  verifyEmailConfiguration().catch((err) => {
    console.error(`❌ Email verification failed: ${err.message}`);
    process.exit(1);
  });
}

async function checkEmailApiConfig(
  providerType: EmailProviderTypes
): Promise<void> {
  if (!process.env.EMAIL_SERVICE_PASS) {
    throw new Error(`❌ ${providerType} API key (EMAIL_SERVICE_PASS) not set`);
  }
  console.log(`✅ ${providerType} API configuration verified`);
}

export {};
