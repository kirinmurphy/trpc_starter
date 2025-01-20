Cypress.Commands.add('cleanupTestUsers', () => {
  cy.task('cleanupTestUsers');
});

Cypress.Commands.add('verifyTestEnvironment', () => {
  cy.task('verifyTestEnvironment');
});
