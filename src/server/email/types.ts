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
  error: {
    type: 
      | 'DELIVERY_FAILED' 
      | 'CONNECTION_ERROR' 
      | 'AUTHENTICATION_ERROR'
      | 'RECIPIENT_ERROR' 
      | 'UNKNOWN'
    message: string;
  };
  messageId: null;
}

export type EmailResult = EmailSuccess | EmailFailure;
