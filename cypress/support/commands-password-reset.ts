Cypress.Commands.add('requestPasswordReset', ({ email }) => {
  cy.visit('/request-reset-password-email');
  cy.get('input[name="email"]').type(email);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('getPasswordResetToken', ({ email }) => {
  return cy
    .task('getPasswordResetToken', { email })
    .then((token: string) => token);
});

Cypress.Commands.add(
  'resetPassword',
  ({
    token,
    newPassword,
    confirmPassword = newPassword,
  }: {
    token: string;
    newPassword: string;
    confirmPassword?: string;
  }) => {
    cy.visit(`/reset-password?token=${token}`);
    cy.get('input[name="password"]').type(newPassword);
    cy.get('input[name="confirmPassword"]').type(confirmPassword);
    cy.get('button[type="submit"]').click();
  }
);
