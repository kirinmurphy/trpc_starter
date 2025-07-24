import 'dotenv/config';

import { defineConfig } from 'cypress';
import * as dbTasks from './cypress/support/tasks/db';
import * as authTasks from './cypress/support/tasks/auth';
import * as revertToInProgressSystemStatus from './cypress/support/tasks/revertToInProgressSystemStatus';
import * as mailhogApi from './cypress/plugins/mailhog';

export default defineConfig({
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
          await dbTasks.verifyTestEnvironment();
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
        ...dbTasks,
        ...authTasks,
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
