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
    host: 'smtp.postmarkapp.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.POSTMARK_API_TOKEN!,
      pass: process.env.POSTMARK_API_TOKEN!
    }
  },
  test: {
    host: 'localhost',
    port: 1025,
    secure: false,
  },
  development: {
    host: 'mailhog',
    port: 1025,
    secure: false,
  }
};

export function createEmailTransporter () {
  const config = emailConfig[process.env.NODE_ENV || 'development'];
  return nodemailer.createTransport(config);
}
