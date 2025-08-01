import nodemailer from 'nodemailer';

interface SmtpTransporterProps {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
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
    pass: process.env.EMAIL_API_KEY!,
  },
};

const isProd = process.env.NODE_ENV === 'production';

const smtpTransportConfig: SmtpTransporterProps = isProd
  ? productionConfig
  : mailhogConfig;

export async function createSmtpEmailTransporter() {
  console.log('Creating email transporter for env', process.env.NODE_ENV);
  return nodemailer.createTransport(smtpTransportConfig);
}
