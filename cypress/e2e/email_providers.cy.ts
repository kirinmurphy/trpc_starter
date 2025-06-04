describe('Email Providers', () => {
  beforeEach(() => {
    cy.task('resetEmailProviderMocks');
  });

  describe('Provider Selection Logic', () => {
    it('uses SMTP provider by default', () => {
      cy.task('testEmailProvider', {
        envVars: {},
        expectedProvider: 'smtp',
      }).should('equal', true)
    });
  });

  it('uses SendGrid when CUSTOM_EMAIL_PROVIDER=sendgrid', () => {
    cy.task('testEmailProvider', {
      envVars: { CUSTOM_EMAIL_PROVIDER: 'sendgrid' },
      expectedProvider: 'sendgrid',
    }).should('equal', true);
  });

  it('falls back to SMTP for unknown provider', () => {
    cy.task('testEmailProvider', {
      envVars: { CUSTOM_EMAIL_PROVIDER: 'unknown-provider' },
      expectedProvider: 'smtp',
    }).should('equal', true);
  });
});

describe('SendGrid Provider Interface', () => {
  it('returns success result with messageId', () => {
    cy.task('testSendGridProvider', {
      scenario: 'success',
      emailOptions: {
        to: 'test@example.com',
        subject: 'Test Subject',
        emailTemplate: '<p>Test content</p>',
      }
    }).then((result: any) => {
      expect(result.success).to.equal(true);
      expect(result.messageId).to.be.a('string');
    });
  });
  
  it('handles API errors appropriately', () => {
    cy.task('testSendGridProvider', {
      scenario: 'api-error',
      emailOptions: {
        to: 'test@example.com',
        subject: 'Test Subject',
        emailTemplate: '<p>Test content</p>',
      }
    }).then((result: any) => {
      expect(result.success).to.equal(false);
      expect(result.error).to.exist;
    });
  });
});