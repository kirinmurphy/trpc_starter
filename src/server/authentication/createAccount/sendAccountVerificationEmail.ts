import { ROUTE_URLS } from "../../../client/routing/routeUrls";
import { sendEmail } from "../../email/sendEmail";
import { getVerificationUrl } from "../utils/getVerificationUrl";

export interface SendVerificationEmailProps {                                                                                                                            
  to: string; 
  verificationToken: string; 
}

export async function sendAccountVerificationEmail (props: SendVerificationEmailProps) {
  const { to, verificationToken } = props;

  const verificationUrl = getVerificationUrl({ 
    verificationToken, 
    route: ROUTE_URLS.verifyAccount 
  });
   
  return sendEmail({
    to,
    subject: 'Verify your email address',
    emailTemplate: `
      <h1>Welcome</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
    `
  });
}
