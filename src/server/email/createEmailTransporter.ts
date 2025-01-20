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

const mailhogConfig = {
  host: 'mailhog',
  port: 1025,
  secure: false,
};

const productionConfig = {
  host: process.env.EMAIL_SERVICE_HOST!,
  port: parseInt(process.env.EMAIL_SERVICE_PORT || '587'),
  secure: process.env.EMAIL_SERVICE_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_SERVICE_USER!,
    pass: process.env.EMAIL_SERVICE_PASS!
  }
};

const isProd = process.env.NODE_ENV === 'production';

const emailConfig: EmailConfigProps = isProd ? productionConfig : mailhogConfig;

export async function createEmailTransporter () {
  console.log('Creating email transporter for env', process.env.NODE_ENV);
  return nodemailer.createTransport(emailConfig);
}
