import { MailhogEmailProps } from "./types";

Cypress.Commands.add('clearEmails', () => {
  cy.task('clearAllEmails');
  cy.wait(1000);
});

Cypress.Commands.add('getLastEmail', ({ email }) => {
  cy.wait(2000);
  return cy.task('getLastEmailByRecipient', { email }).then(emailResponse => {
    cy.wrap(emailResponse).should('not.be.null');
    return cy.wrap(emailResponse as MailhogEmailProps);
  });
});
