import { createEmailTransporter } from '../src/server/email/createEmailTransporter';

async function verifySMTPConnection() {
  const transporter = await createEmailTransporter();
  await transporter.verify();
  console.log('✅ SMTP connection verified');
  transporter.close();
}

if (require.main === module) {
  await verifySMTPConnection().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

export {};
