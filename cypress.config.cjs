const { defineConfig } = require('cypress');
const { verifyTestEnvironment, cleanupTestUsers } = require('./cypress/support/db.cjs');
require('dotenv').config();

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

      on('before:run', () => {
        console.log('Test run starting');
      });

      on('after:run', () => {});

      on('task', {
        async cleanupTestUsers() {
          await cleanupTestUsers();
          return null;
        },
        async verifyTestEnvironment() {
          await verifyTestEnvironment();
          return null;
        }
      });

      verifyTestEnvironment()
        .then(() => console.log('Test environment verified'))
        .catch(console.error);

      return config;
    },
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',   
  },
});
