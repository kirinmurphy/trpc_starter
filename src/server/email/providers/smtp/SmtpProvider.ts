import { EmailProvider, EmailOptions, EmailResult } from "../../types";
import { getMailerError } from "../../getMailerError";
import { getEmailMessageProps } from "../../getEmailMessageProps";
import { createSmtpEmailTransporter } from './createSmtpEmailTransporter';

const isProd = process.env.NODE_ENV === 'production';

export const SmtpProvider: EmailProvider = {
  async sendEmail(props: EmailOptions): Promise<EmailResult> {
   
    const transporter = await createSmtpEmailTransporter();

    try {
      const info = await transporter.sendMail({ 
        ...props,
        ...getEmailMessageProps(props)
      });

      if (!isProd) { console.log('Email sent: ', info.messageId); }

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: unknown) {
      throw getMailerError({ error, options: props });
    } finally {
      transporter.close();
    }
  } 
};
