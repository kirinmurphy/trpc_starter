import { AuthActionProps, MailhogEmailProps } from "./types";

Cypress.Commands.add('cleanupTestUsers', () => {
  cy.task('cleanupTestUsers');
});

Cypress.Commands.add('verifyTestEnvironment', () => {
  cy.task('verifyTestEnvironment');
});

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

  cy.wait(1000);

  // cy.getLastEmail({ email: demoUser.email }).then(emailAttempt => {
  //   expect(emailAttempt.Raw.To.includes(demoUser.email)).to.equal(true);
  //   expect(emailAttempt.Content.Headers.Subject).to.include("Verify your email address");
  //   expect(emailAttempt.Content.Body).to.include('Welcome');
  // });

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

// -- EMAIL 
Cypress.Commands.add('clearEmails', () => {
  cy.task('clearAllEmails');
  cy.wait(1000);
});

Cypress.Commands.add('getLastEmail', ({ email }) => {
  cy.wait(5000);
  return cy.task('getLastEmailByRecipient', { email }).then(emailResponse => {
    cy.wrap(emailResponse).should('not.be.null');
    return cy.wrap(emailResponse as MailhogEmailProps);
  });
});
