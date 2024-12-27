import { createEmailTransporter } from "./createEmailTransporter";

const defaultFrom = '"codethings.net" <noreply@codethings.net>';

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
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  } finally {
    transporter.close();
  }
}
