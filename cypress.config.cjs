const { defineConfig } = require('cypress');
const {
  verifyTestEnvironment,
  cleanupTestUsers,
} = require('./cypress/support/tasks/db.cjs');
const {
  getVerificationToken,
  getPasswordResetToken,
} = require('./cypress/support/tasks/auth.cjs');
const revertToInProgressSystemStatus = require('./cypress/support/tasks/revertToInProgressSystemStatus.cjs');

const mailhogApi = require('./cypress/plugins/mailhog.cjs');

require('dotenv').config();

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        TEST_DB_NAME: process.env.TEST_DB_NAME,
      };

      on('before:run', async () => {
        console.log('Test run starting');
        try {
          await verifyTestEnvironment();
        } catch (err) {
          console.error('Test environment verification failed: ', err);
          throw err;
        }
      });

      on('after:run', () => {});

      on('task', {
        log(message) {
          console.log(message + '\n');
          return null;
        },
        async cleanupTestUsers() {
          await cleanupTestUsers();
          return null;
        },
        async verifyTestEnvironment() {
          await verifyTestEnvironment();
          return null;
        },
        async getVerificationToken({ email }) {
          return await getVerificationToken({ email });
        },
        async getPasswordResetToken({ email }) {
          return await getPasswordResetToken({ email });
        },
        ...mailhogApi,
        ...revertToInProgressSystemStatus,
      });

      return config;
    },
    baseUrl: process.env.INTERNAL_CLIENT_URL,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
  },
});
