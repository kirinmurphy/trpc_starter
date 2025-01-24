import { ROUTE_URLS } from "../../../client/routing/routeUrls";
import { sendEmail } from "../../email/sendEmail";

export interface SendVerificationEmailProps {                                                                                                                            
  to: string; 
  verificationToken: string; 
}

export async function sendVerificationEmail (props: SendVerificationEmailProps) {
  const { to, verificationToken } = props;

  const verificationUrl = getVerificationUrl({ verificationToken });
   
  const response = sendEmail({
    to,
    subject: 'Verify your email address',
    html: `
      <!DOCTYPE html>
      <html>
      <head></head>
      <body>
        <h1>Welcome</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${verificationUrl}</p>
      </body>
      </html>
    `
  });

  response.then((result) => {
    console.log('resullllllt', result);
  });

  return response;
}

function getVerificationUrl ({ verificationToken }: { verificationToken: string }): string {
  const route = ROUTE_URLS.verifyAccount;
  const domain = process.env.CLIENT_DOMAIN || 'localhost';
  const protocol = process.env.API_PROTOCOL || 'http';
  return `${protocol}://${domain}${route}?token=${verificationToken}`;
}
