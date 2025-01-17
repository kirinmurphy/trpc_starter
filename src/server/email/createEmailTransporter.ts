import nodemailer from 'nodemailer';

interface EmailConfigProps {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  }
}

// TODO: turn these all into env vars
const emailConfig: Record<string, EmailConfigProps> = {
  production: {
    host: process.env.EMAIL_SERVICE_HOST!,
    port: parseInt(process.env.EMAIL_SERVICE_PORT || '587'),
    secure: process.env.EMAIL_SERVICE_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVICE_USER!,
      pass: process.env.EMAIL_SERVICE_PASS!
    }
  },
  development: {
    host: 'mailhog',
    port: 1025,
    secure: false,
  }
};

export function createEmailTransporter () {
  if ( process.env.NODE_ENV === 'test' ) {
    return {
      sendMail: async () => { 
        return { 
          messageId: 'mock-email-id',
        }
      },
      close: () => {}
    }
  } 
  
  const config = emailConfig[process.env.NODE_ENV || 'development'];

  return nodemailer.createTransport(config);
}
