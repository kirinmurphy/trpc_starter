const { defineConfig } = require('cypress');
const { verifyTestEnvironment, cleanupTestUsers } = require('./cypress/support/db.cjs');
const { createTestPool } = require('./cypress/support/db.cjs');

require('dotenv').config();

const pool = createTestPool();

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
        },
        async getVerificationToken({ email }) {
          const result = await pool.query(
            'SELECT token FROM verification_tokens WHERE email = $1 ORDER BY expires_at DESC LIMIT 1',
            [email]
          );
          return result.rows[0]?.token || null;
        }
      });

      return config;
    },
    baseUrl: process.env.INTERNAL_CLIENT_URL,
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',   
    defaultCommandTimeout: 10000,
    requestTimeout: 10000
  },
});
