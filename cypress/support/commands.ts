import { AuthActionProps } from "./types";

Cypress.Commands.add('cleanupTestUsers', () => {
  cy.task('cleanupTestUsers');
});

Cypress.Commands.add('verifyTestEnvironment', () => {
  cy.task('verifyTestEnvironment');
});

Cypress.Commands.add('signUp', ({ demoUser }: AuthActionProps) => {
  cy.visit('/');
  cy.contains('a', 'SIGN UP').click();
  cy.get('input[type="name"]').type(demoUser.name);
  cy.get('input[type="email"]').type(demoUser.email);
  cy.get('input[type="password"]').type(demoUser.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});

Cypress.Commands.add('login', ({ demoUser }: AuthActionProps) => {
  cy.visit('/');
  cy.contains('a', 'LOGIN').click();
  cy.get('input[type="email"]').type(demoUser.email);
  cy.get('input[type="password"]').type(demoUser.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
});
