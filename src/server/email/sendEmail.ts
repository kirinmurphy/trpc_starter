import { createEmailTransporter } from "./createEmailTransporter";
import { getMailerError } from "./getMailerError";
import { EmailOptions, EmailResult } from "./types";

const fromEmail = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS;
<<<<<<< HEAD
const fromName = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_SENDER;
=======
const fromName = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_NAME;
>>>>>>> 3e7cbb5 (added email integration)
const defaultFrom = `"${fromName}" <${fromEmail}>`;

export async function sendEmail (options: EmailOptions): Promise<EmailResult>{
  const { from = defaultFrom, subject } = options;
  const transporter = createEmailTransporter();

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
    return {
      success: false,
      error: getMailerError({ error, options }), 
      messageId: null
    };
  } finally {
    transporter.close();
  }
}
