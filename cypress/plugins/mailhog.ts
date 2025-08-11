import fetch from 'node-fetch';

const MAILHOG_API = 'http://mailhog:8025/api';
const MOCK_CONFIG_ENDPOINT = `${MAILHOG_API}/v2/jim`;

interface MailhogConfig {
  DisconnectChance?: number;
  AcceptChance?: number;
  LinkSpeedAffect?: number;
  LinkSpeedMin?: number;
  LinkSpeedMax?: number;
  RejectSenderChance?: number;
  RejectRecipientChance?: number;
  RejectAuthChance?: number;
  [key: string]: any;
}

export async function getAllEmails(): Promise<any> {
  const response = await fetch(`${MAILHOG_API}/v2/messages`);
  return response.json();
}

export async function clearAllEmails(): Promise<null> {
  await fetch(`${MAILHOG_API}/v1/messages`, { method: 'DELETE' });
  return null;
}

export async function getLastEmailByRecipient({
  email,
  timeout = 10000,
}: {
  email: string;
  timeout?: number;
}): Promise<any> {
  const startTime = Date.now();
  let emailMessage = null;

  while (Date.now() - startTime < timeout) {
    const { items } = await getAllEmails();

    emailMessage = items.find((item) => {
      return item.To.find((recipient) => {
        const msgEmail = `${recipient.Mailbox}@${recipient.Domain}`;
        return msgEmail === email;
      });
    });

    if (emailMessage) {
      return emailMessage;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return null;
}

export async function configureMailhogMockResponse(
  config?: MailhogConfig
): Promise<null> {
  await fetch(MOCK_CONFIG_ENDPOINT, { method: 'DELETE' });

  await fetch(MOCK_CONFIG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DisconnectChance: 0.0,
      AcceptChance: 1,
      LinkSpeedAffect: 0.1,
      LinkSpeedMin: 1024,
      LinkSpeedMax: 10240,
      RejectSenderChance: 0.0,
      RejectRecipientChance: 0.0,
      RejectAuthChance: 0.0,
      ...(config || {}),
    }),
  });

  return null;
}
