const fetch = require('node-fetch');

const MAILHOG_API = 'http://mailhog:8025/api';

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
  getLastEmailByRecipient: async ({ email }) => {
    const { items } = await getAllEmails();
    
    const message = items.find(item => {
      return item.To.find(recipient => {
        const msgEmail = `${recipient.Mailbox}@${recipient.Domain}`;
        return msgEmail === email;
      });
    });

    console.log('message', message);
    return message || null;
  }
}
