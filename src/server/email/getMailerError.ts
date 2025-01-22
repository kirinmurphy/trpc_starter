import { EmailOptions, EmailFailure } from "./types";

interface NodemailerError extends Error {
  code?: string;
  command?: string;
  response?: string;
  responseCode?: number;
}

interface Props {
  error: unknown; 
  options: EmailOptions;
}

export function getMailerError ({ error, options }: Props) {
  const mailerError = error as NodemailerError;

  console.error('Failed to send email: ', {
    ...mailerError,
    ...options
  });

  let errorType: EmailFailure['error']['type'] = 'UNKNOWN';

  console.log('MAILERERROR', mailerError);
  
  if ( mailerError.code === '' || mailerError.code === 'ETIMEDOUT' || mailerError.message?.includes('socket close') ) {
    errorType = 'CONNECTION_ERROR';

  } else if ( mailerError.responseCode === 500 ) {
    errorType = 'RECIPIENT_ERROR';

  } else if ( mailerError.response?.includes('delivery failed') ) {
    errorType = 'DELIVERY_FAILED';

  // smtp auth wiring not set up, optimized for auth with 3rd party api (like sendgrid)
  } else if ( mailerError.code === 'EAUTH' ) {
    errorType = 'AUTHENTICATION_ERROR';
  } 

  return { 
    type: errorType,
    message: mailerError.message,
  };
}
