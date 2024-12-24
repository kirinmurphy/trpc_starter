import { createEmailTransporter } from "./createEmailTransporter";

interface EmailOptions {
  to: string;
  subject: string;
  html: string; 
  from?: string;
}

export async function sendEmail (options: EmailOptions) {
  const transporter = createEmailTransporter();
  const defaultFrom = '"codethings.net" <noreply@codethings.net>';

  try {
    const info = await transporter.sendMail({
      ...options,
      from: options.from || defaultFrom,
      subject: 'JAMOFERAPP',
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
