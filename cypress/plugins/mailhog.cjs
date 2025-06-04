const fetch = require('node-fetch');

const MAILHOG_API = 'http://mailhog:8025/api';
const MOCK_CONFIG_ENDPOINT = `${MAILHOG_API}/v2/jim`;

async function getAllEmails () {
  const response = await fetch(`${MAILHOG_API}/v2/messages`);
  return response.json();
}

module.exports = {
  getAllEmails,
  clearAllEmails: async () => {
    await fetch(`${MAILHOG_API}/v1/messages`, { method: 'DELETE' }); 
    return null;
  },
  // TODO: format the email item to be a little more consumable for task users
  getLastEmailByRecipient: async ({ email }) => {
    const { items } = await getAllEmails();
    
    const message = items.find(item => {
      return item.To.find(recipient => {
        const msgEmail = `${recipient.Mailbox}@${recipient.Domain}`;
        return msgEmail === email;
      });
    });
    return message || null;
  },
  configureMailhogMockResponse: async (config) => {    
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
}
