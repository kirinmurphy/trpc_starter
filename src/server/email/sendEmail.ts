import { createEmailTransporter } from "./createEmailTransporter";
import { getMailerError } from "./getMailerError";
import { EmailOptions, EmailResult } from "./types";

const fromEmail = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS;
const fromName = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_SENDER;
const defaultFrom = `"${fromName}" <${fromEmail}>`;

export async function sendEmail (options: EmailOptions): Promise<EmailResult>{
  // TODO: split function arg for from to fromEmail and fromName (fromSender),
  //  so we can have more precision in checking the address
  const { from = defaultFrom, subject } = options;

  console.log('========= From', from);
  if ( !from ) {
    throw new Error('from address not defined');
  }
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
    return {
      success: false,
      error: getMailerError({ error, options }), 
      messageId: null
    };
  } finally {
    transporter.close();
  }
}
