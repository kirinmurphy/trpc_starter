import {
  EmailOptions,
  EmailProvider,
  EmailProviderTypes,
  EmailResult,
} from './types';
import { SmtpProvider } from './providers/smtp/SmtpProvider';
import { SendGridApiProvider } from './providers/SendGridApiProvider';
import { ResendApiProvider } from './providers/ResendApiProvider';

const providerMap: Record<EmailProviderTypes, EmailProvider> = {
  [EmailProviderTypes.SENDGRID]: SendGridApiProvider,
  [EmailProviderTypes.RESEND]: ResendApiProvider,
  [EmailProviderTypes.SMTP]: SmtpProvider,
};

export async function sendEmail(props: EmailOptions): Promise<EmailResult> {
  const customProvider = process.env.CUSTOM_EMAIL_PROVIDER;

  if (customProvider && customProvider in providerMap) {
    return providerMap[customProvider as EmailProviderTypes].sendEmail(props);
  }

  return SmtpProvider.sendEmail(props);
}
