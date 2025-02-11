import { createEmailTransporter } from "./createEmailTransporter";
import { getMailerError } from "./getMailerError";
import { EmailOptions, EmailResult } from "./types";

const websiteDomain = process.env.WEBSITE_DOMAIN;
const systemEmailDefault = `noreply@${websiteDomain}`;
const defaultFromEmail = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS || systemEmailDefault;
const defaultFromName = process.env.EMAIL_SERVICE_SYSTEM_EMAIL_SENDER || websiteDomain;

export async function sendEmail (props: EmailOptions): Promise<EmailResult>{
  const { 
    fromEmail = defaultFromEmail,
    fromSender = defaultFromName, 
    emailTemplate    
  } = props;

  const transporter = await createEmailTransporter();

  const from = `"${fromSender}" <${fromEmail}>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
      ${emailTemplate}
    </body>
    </html>    
  `;

  try {
    const info = await transporter.sendMail({
      ...props, from, html
    });

    if ( process.env.NODE_ENV !== 'production' ) {
      console.log('Email sent: ', info.messageId);
    }

    return {
      success: true, 
      messageId: info.messageId
    };
  } catch (error: unknown) {
    throw getMailerError({ error, options: props });
  } finally {
    transporter.close();
  }
}
