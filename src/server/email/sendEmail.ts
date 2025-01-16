import { createEmailTransporter } from "./createEmailTransporter";

const fromEmail = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS;
const fromName = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_NAME;
const defaultFrom = `"${fromName}" <${fromEmail}>`;

interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string; 
  from?: string;
}

export async function sendEmail (options: EmailOptions) {
  const { from = defaultFrom, subject } = options;
  const transporter = createEmailTransporter();

  try {
    const info = await transporter.sendMail({
      ...options, from, subject,
    });

    if ( process.env.NODE_ENV !== 'production' ) {
      console.log('Email sent: ', info.messageId);
    }

    return info;
  } catch (error: unknown) {
    const mailerError = error as NodemailerError;

    console.error('Failed to send email: ', {
      error: mailerError.message,
      code: mailerError.code,
      response: mailerError.response,
      to: options.to,
      subject: options.subject
    });

    return {
      success: false,
      error: mailerError.message,
      messageId: null
    };
  } finally {
    transporter.close();
  }
}
