import { sendEmail } from "../../email/sendEmail";

export async function sendVerificationEmail ({ to, token }: { to: string; token: string; }) {
  const verificationUrl = `http://localhost:3000/verify?token=${token}`;

  return sendEmail({
    to,
    subject: 'Verify your email address',
    html: `<!DOCTYPE html>
    <html>
    <head></head>
    <body>
      <h1>Welcome</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
    </body>
    </html>`
  });
}
