import './commands-auth';
import './commands-db';
import './commands-email';
import './commands-password-reset';

beforeEach(() => {
  cy.resetMockEmailServer();
  cy.reload(true);
});
