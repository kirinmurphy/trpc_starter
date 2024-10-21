const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:run', () => {
        console.log('Test run starting, ');
      });

      on('after:run', () => {
        // Your after:run logic here
      });

      on('task', {
        // Your tasks here
      });

      return config;
    },
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',   
  },
});