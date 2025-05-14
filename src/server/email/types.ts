export interface EmailOptions {
  to: string;
  subject: string;
  emailTemplate: string;
  fromEmail?: string;
  fromSender?: string;
}

export interface EmailSuccess {
  success: true;
  messageId: string;
}

export interface EmailFailure {
  success: false;
  error: {
    type:
      | 'DELIVERY_FAILED'
      | 'CONNECTION_ERROR'
      | 'AUTHENTICATION_ERROR'
      | 'RECIPIENT_ERROR'
      | 'UNKNOWN';
    message: string;
  };
  messageId: null;
}

export type EmailResult = EmailSuccess | EmailFailure;

export interface EmailProvider {
  sendEmail(options: EmailOptions): Promise<EmailResult>;
}                                

export enum EmailProviderTypes {
  SMTP = 'smtp',
  SENDGRID = 'sendgrid'
}
