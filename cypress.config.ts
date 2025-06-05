import { defineConfig } from 'cypress';
import 'dotenv/config';

import {
  verifyTestEnvironment,
  cleanupTestUsers,
} from './cypress/support/tasks/db';
import {
  getVerificationToken,
  getPasswordResetToken,
} from './cypress/support/tasks/auth';
import * as mailhogApi from './cypress/plugins/mailhog';
import * as revertToInProgressSystemStatus from './cypress/support/tasks/revertToInProgressSystemStatus';

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: true,
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
