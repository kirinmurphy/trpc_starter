const websiteDomain = process.env.WEBSITE_DOMAIN;
const systemEmailDefault = `noreply@${websiteDomain}`;
const defaultFromEmail =
  process.env.EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS || systemEmailDefault;
const defaultFromName =
  process.env.EMAIL_SERVICE_SYSTEM_EMAIL_SENDER || websiteDomain;

interface Props { 
  fromEmail?: string; 
  fromSender?: string; 
  emailTemplate?: string;
}

export function getEmailMessageProps(props: Props) {
  const fromEmail = props.fromEmail || defaultFromEmail;
  const fromSender =  props.fromSender || defaultFromName;
  const from =  `"${fromSender}" <${fromEmail}>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head></head>
    <body>
      ${props.emailTemplate}
    </body>
    </html>    
  `;

  return {
    from,
    fromEmail,
    fromSender,
    html
  }
}
