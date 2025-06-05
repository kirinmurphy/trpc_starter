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

export async function getAllEmails (): Promise<any> {
  const response = await fetch(`${MAILHOG_API}/v2/messages`);
  return response.json();
}

export async function clearAllEmails(): Promise<null> {
  await fetch(`${MAILHOG_API}/v1/messages`, { method: 'DELETE' }); 
  return null;
}

export async function getLastEmailByRecipient({ email }: { email: string; }): Promise<any> {
    const { items } = await getAllEmails();
    
    const message = items.find(item => {
      return item.To.find(recipient => {
        const msgEmail = `${recipient.Mailbox}@${recipient.Domain}`;
        return msgEmail === email;
      });
    });
    return message || null;
}


export async function configureMailhogMockResponse (config?: MailhogConfig): Promise<null> {    
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
        RejectSenderChance: 0.00,
        RejectRecipientChance: 0.00,
        RejectAuthChance: 0.00,
        ...(config || {})
      })      
    });
        
    return null;
  }
