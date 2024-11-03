const { defineConfig } = require('cypress');
const { verifyTestEnvironment, cleanupTestUsers } = require('./cypress/support/db.cjs');
require('dotenv').config();

const isDocker = process.env.IN_DOCKER === 'true';
const baseUrl = isDocker ? 'http://app:5173' : 'http://localhost:5173';

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

      config.env = {
        ...config.env,
        DB_USER: process.env.DB_USER,
        DB_HOST: process.env.DB_HOST,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_PORT: process.env.DB_PORT,
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
        }
      });

      config.baseUrl = baseUrl;
      return config;
    },
    baseUrl,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',   
    defaultCommandTimeout: 10000,
    requestTimeout: 10000
  },
});
