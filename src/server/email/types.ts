export interface EmailOptions {
  to: string;
  subject: string;
  html: string; 
  fromEmail?: string;
  fromSender?: string;
}

export interface EmailSuccess {
  success: true;
  messageId: string;
}

export interface EmailFailure {
  success: false;
  messageId: null;
}

export type EmailResult = EmailSuccess | EmailFailure;
