let mockSendGridResponse = { success: true, messageId: 'test-message-id' };
let mockSendGridError = null;

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === '@sendgrid/mail') {
    return mockSendGrid();
  }
  return originalRequire.apply(this, arguments);
};

async function resetEmailProviderMocks() {
  mockSendGridResponse = { success: true, messageId: 'test-message-id' };
  mockSendGridError = null;
  return null;
}

async function testEmailProvider({ envVars, expectedProvider }) {
  const originalEnv = { ...process.env };
  Object.assign(process.env, envVars);

  try {
    delete require.cache[require.resolve('../../../src/server/email/sendEmail.js')];
    const { sendEmail } = require('../../../src/server/email/sendmakEmail.js');

    const testEmail = {
      to: 'test@example.com',
      subject: 'Test',
      emailTemplate: '<p>Test</p>'
    };

    const result = await sendEmail(testEmail);
    
    return result.success === true && typeof result.messageId === 'string';
    
  } finally {
    process.env = originalEnv;
  }
}

async function testSendGridProvider({ scenario, emailOptions }) {
  if (scenario === 'success') {
    mockSendGridError = null;
    mockSendGridResponse = { success: true, messageId: 'sendgrid-test-id' };
  } else if (scenario === 'api-error') {
    mockSendGridError = new Error('SendGrid API Error');
  }

  const originalEnv = process.env.CUSTOM_EMAIL_PROVIDER;
  process.env.CUSTOM_EMAIL_PROVIDER = 'sendgrid';
  process.env.EMAIL_SERVICE_PASS = 'test-api-key';

  try {
    delete require.cache[require.resolve('../../../src/server/email/sendEmail.ts')];
    const { sendEmail } = require('../../../src/server/email/sendEmail.ts');

    const result = await sendEmail(emailOptions);
    return result;
    
  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    process.env.CUSTOM_EMAIL_PROVIDER = originalEnv;
  }
}

module.exports = {
  resetEmailProviderMocks,
  testEmailProvider,
  testSendGridProvider,
};

function mockSendGrid() {
  return {
    default: {
      setApiKey: () => {},
      send: async () => {
        if (mockSendGridError) {
          throw mockSendGridError;
        }
        return [{ 
          statusCode: 202, 
          headers: { 'x-message-id': mockSendGridResponse.messageId } 
        }];
      }
    }
  };
}
