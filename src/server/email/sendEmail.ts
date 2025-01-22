import { createEmailTransporter } from "./createEmailTransporter";
import { getMailerError } from "./getMailerError";
import { EmailOptions, EmailResult } from "./types";

const defaultFromEmail = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS || 'test@email.com';
const defaultFromName = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_SENDER || 'Test Sender';

export async function sendEmail (options: EmailOptions): Promise<EmailResult>{
  const { 
    fromEmail = defaultFromEmail,
    fromSender = defaultFromName, 
    subject 
  } = options;

  const from = `"${fromSender}" <${fromEmail}>`;

  const transporter = await createEmailTransporter();

  try {
    const info = await transporter.sendMail({
      ...options, from, subject,
    });

    if ( process.env.NODE_ENV !== 'production' ) {
      console.log('Email sent: ', info.messageId);
    }

    return {
      success: true, 
      messageId: info.messageId
    };
  } catch (error: unknown) {
    // TODO: add logging to the error, don't need to send back specific error to UI 
    const mailerError = getMailerError({ error, options });
    console.log('mailerError', mailerError);

    return {
      success: false,
      messageId: null
    };
  } finally {
    transporter.close();
  }
}
