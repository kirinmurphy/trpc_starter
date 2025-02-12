import { MailhogEmailProps } from './types';

Cypress.Commands.add('clearEmails', () => {
  cy.task('clearAllEmails');
  cy.wait(1000);
});

Cypress.Commands.add('getLastEmail', ({ email }) => {
  cy.wait(2000);
  return cy.task('getLastEmailByRecipient', { email }).then((emailResponse) => {
    cy.wrap(emailResponse).should('not.be.null');
    return cy.wrap(emailResponse as MailhogEmailProps);
  });
});

Cypress.Commands.add('resetMockEmailServer', () => {
  cy.task('configureMailhogMockResponse');
});

Cypress.Commands.add('simulateEmailSendFailure', (type: string) => {
  const configs = {
    connectionError: { DisconnectChance: 1.0, AcceptChance: 0 },
    recipientError: { RejectRecipientChance: 1.0, AcceptChance: 0 },
    deliveryError: { RejectSenderChance: 1.0 },
  };

  cy.task('configureMailhogMockResponse', configs[type]);
});
