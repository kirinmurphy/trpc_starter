import { getEmailMessageProps } from '../getEmailMessageProps';
import {
  EmailProvider,
  EmailOptions,
  EmailResult,
  EmailFailure,
} from '../types';
import { Resend } from 'resend';

const MISSING_API_KEY_MSG = 'Resend API Key not set';
const resendApiKey = process.env.EMAIL_SERVICE_PASS;
const isProd = process.env.NODE_ENV === 'production';

export const ResendApiProvider: EmailProvider = {
  async sendEmail(props: EmailOptions): Promise<EmailResult> {
    const { to, subject } = props;
    const { from, html } = getEmailMessageProps(props);

    if (!resendApiKey) {
      throw new Error(MISSING_API_KEY_MSG);
    }

    const resend = new Resend(resendApiKey);

    try {
      const { data, error } = await resend.emails.send({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });

      if (error) {
        throw error;
      }

      if (!isProd) {
        console.log('Email sent with Resend API:', { id: data?.id });
      }

      return {
        success: true,
        messageId: data?.id || 'resend-message-id',
      };
    } catch (err: unknown) {
      console.error('Error sending email with Resend API:', err);

      let errorType: EmailFailure['error']['type'] = 'UNKNOWN';
      let errorMessage: string = 'An unknown error occured with Resend.';

      if (err instanceof Error && err.message === MISSING_API_KEY_MSG) {
        errorType = 'AUTHENTICATION_ERROR';
        errorMessage = MISSING_API_KEY_MSG;
      } else if (err && typeof err === 'object' && 'message' in err) {
        if ('name' in err && err?.name === 'ResendError') {
          errorType = 'DELIVERY_FAILED';
          errorMessage = `Resend API Error: ${err.message}`;
        } else {
          errorType = 'CONNECTION_ERROR';
          errorMessage = `Network or unexpected error: ${err.message}`;
        }
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      return {
        success: false,
        error: {
          type: errorType,
          message: errorMessage,
        },
        messageId: null,
      };
    }
  },
};
