import { EmailOptions, EmailFailure } from "./types";

interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

export function getMailerError ({ error, options }: { error: unknown; options: EmailOptions }) {
  const mailerError = error as NodemailerError;

  console.error('Failed to send email: ', {
    ...mailerError,
    ...options
  });

  let errorType: EmailFailure['error']['type'] = 'UNKNOWN';

  if ( mailerError.code === '' || mailerError.code === 'ETIMEDOUT' ) {
    errorType = 'CONNECTION_ERROR';
  } else if ( mailerError.code === 'EAUTH' ) {
    errorType = 'AUTHENTICATION_ERROR';
  } else if ( mailerError.responseCode === 500 ) {
    errorType = 'RECIPIENT_ERROR';
  } else if ( mailerError.response?.includes('delivery failed') ) {
    errorType = 'DELIVERY_FAILED';
  } 

  return { 
    type: errorType,
    message: mailerError.message,
  };
}
