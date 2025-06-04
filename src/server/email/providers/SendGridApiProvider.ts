import { EmailProvider, EmailOptions, EmailResult } from "../types";
import { getEmailMessageProps } from "../getEmailMessageProps";
import { getMailerError } from "../getMailerError";

const sendgridApiKey = process.env.EMAIL_SERVICE_PASS; 

const isProd = process.env.NODE_ENV !== 'production';

export const SendGridApiProvider: EmailProvider = {
  async sendEmail(props: EmailOptions): Promise<EmailResult> {
    const { to, subject } = props; 
    const { html, from } = getEmailMessageProps(props);

    if ( !sendgridApiKey ) {
      throw new Error('Sendgrid API Key not set'); 
    }

    const sgMailModule = await import('@sendgrid/mail');
    const sgMail = sgMailModule.default;

    sgMail.setApiKey(sendgridApiKey);

    const response = await sgMail.send({ to, from, subject, html });
    const { statusCode, headers } = response[0];
    const messageId = headers['x-message-id'] || 'sendgrid-message';

    if (!isProd) {
      console.log('Email sent with SendGrid API:', { statusCode, messageId });
    }

    return {
      success: true,
      messageId
    };
  } 
};
