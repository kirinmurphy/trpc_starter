import { AuthActionProps } from "./types";

Cypress.Commands.add('createAccountAttempt', ({ demoUser }: AuthActionProps) => {
  cy.visit('/');
  cy.contains('a', 'SIGN UP').click();  
  cy.get('input[type="name"]').type(demoUser.name, { delay: 100 });
  cy.get('input[type="email"]').type(demoUser.email, { delay: 100 });
  cy.get('input[type="password"]').type(demoUser.password, { delay: 100 });
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('createAccount', ({ demoUser }: AuthActionProps) => {
  cy.createAccountAttempt({ demoUser });
  const msg = "We have sent a verification link to the email you provided.";
  cy.contains(msg).should('be.visible');
});

Cypress.Commands.add('verifyAccount', ({ email }: { email: string }) => {
  cy.getVerificationToken({ email }).should('exist').then(token => {
    cy.visit(`/verify-account?token=${token}`);
    cy.contains('Verifying...').should('be.visible');
    cy.url().should('include', '/home');
  });
});

Cypress.Commands.add('signUpAndVerify', ({ demoUser }: AuthActionProps) => {
  cy.createAccount({ demoUser });
  cy.verifyAccount({ email: demoUser.email });
});

Cypress.Commands.add('login', ({ demoUser }: AuthActionProps) => {
  cy.visit('/');
  cy.contains('a', 'LOGIN').click();
  cy.get('input[type="email"]').type(demoUser.email);
  cy.get('input[type="password"]').type(demoUser.password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('getVerificationToken', ({ email }: { email: string; }) => {
  return cy.task('getVerificationToken', { email });
});