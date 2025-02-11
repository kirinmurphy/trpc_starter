describe('Password Reset Workflow', () => {
  const DEMO_USER = {
    name: 'Test User',
    email: 'testtt@gmail.com',
    password: 'P@ssword-123'
  } as const;

  before(() => {
    cy.verifyTestEnvironment();
    cy.cleanupTestUsers();
    cy.createAccountAndVerify({ demoUser: DEMO_USER });
    cy.contains('button', 'Logout').click();
    cy.wait(500);
  });

  after(() => {
    cy.cleanupTestUsers();
  });
  
  describe('Request Password Reset', () => {
    after(() => {
      cy.clearEmails();
    });

    describe('request success', () => {

      it('sends reset password email when account exists', () => {
        cy.requestPasswordReset({ email: DEMO_USER.email });
        
        cy.contains('Thank you').should('be.visible');
        cy.contains('If there is an account associated with this email').should('be.visible');

        cy.getPasswordResetToken({ email: DEMO_USER.email }).should('exist').then(token => {
          cy.getLastEmail({ email: DEMO_USER.email }).then(emailAttempt => {
            expect(emailAttempt.Raw.To.includes(DEMO_USER.email));
            expect(emailAttempt.Content.Headers.Subject).to.include("Reset your password");
            expect(emailAttempt.Content.Body).to.include(token);
          });
        });
      });

      it('shows same success message even when account does not exist (security)', () => {
        cy.requestPasswordReset({ email: 'nonexistent@email.com' });
        cy.contains('Thank you').should('be.visible');
        cy.contains('If there is an account associated with this email').should('be.visible');
      });
    });

    describe('request failures', () => {
      beforeEach(() => {
        cy.resetMockEmailServer();
      });

      it('renders a form error if email is not sent', () => {
        cy.simulateEmailSendFailure('deliveryError');
        cy.requestPasswordReset({ email: DEMO_USER.email });
        const error = 'There was a problem completing the request. Please wait a moment and try again.';
        cy.contains(error).should('be.visible');
        
        cy.resetMockEmailServer();
        cy.contains('button', 'Reset Password').click();
        cy.contains('Thank you').should('be.visible');
      });
    });
  });

  describe('Password Reset Verification', () => {
    beforeEach(() => {
      cy.requestPasswordReset({ email: DEMO_USER.email });
    });

    afterEach(() => {
      cy.clearEmails();
      cy.resetMockEmailServer();
    })

    describe('verification success', () => {
      it('allows user to reset password with valid tokenn', () => {
        expect(1).to.equal(1);
        const newPassword = 'NewP@ssword-123';
        
        cy.getPasswordResetToken({ email: DEMO_USER.email }).should('exist').then(token => {
          cy.resetPassword({ token, newPassword });
          cy.url().should('include', '/login');
          cy.contains('Your password was updated successfully. Login with your new password to continue.').should('be.visible');
          
          cy.login({ demoUser: { ...DEMO_USER, password: newPassword }});
          cy.url().should('include', '/home');
        });
      });
    });

    describe('verification failures', () => {
      it('shows error for expired token', () => {
        cy.getPasswordResetToken({ email: DEMO_USER.email }).should('exist').then(token => {
          cy.wait(16000); 
          cy.visit(`/reset-password?token=${token}`);
          cy.url().should('include', '/request-reset-password-email');
          cy.contains('The password reset link you used has expired. Please request another link.').should('be.visible');
        });
      });

      it('shows error for invalid token', () => {
        cy.visit(`/reset-password?token=FAKETOKEN23ijook2j3FAKEFAKEk32jk3`);
        cy.url().should('include', '/request-reset-password-email');
        const errorMsg = 'There was a problem verifying your account. If you think this is an error, please try again.';
        cy.contains(errorMsg).should('be.visible');
      });

      it('shows error when passwords do not match', () => {
        cy.getPasswordResetToken({ email: DEMO_USER.email }).should('exist').then(token => {
          cy.resetPassword({ 
            token,
            newPassword: 'NewP@ssword-123',
            confirmPassword: 'DifferentP@ssword-123'
          });
          cy.contains('Passwords must match').should('be.visible');
        });
      });
    });
  });
});

Cypress.Commands.add('requestPasswordReset', ({ email }) => {
  cy.visit('/request-reset-password-email');
  cy.get('input[name="email"]').type(email);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('getPasswordResetToken', ({ email }) => {
  return cy.task('getPasswordResetToken', { email }).then((token: string) => token);
});

Cypress.Commands.add('resetPassword', ({ 
  token, 
  newPassword,
  confirmPassword = newPassword 
}: { 
  token: string;
  newPassword: string;
  confirmPassword?: string;
}) => {
  cy.visit(`/reset-password?token=${token}`);
  cy.get('input[name="password"]').type(newPassword);
  cy.get('input[name="confirmPassword"]').type(confirmPassword);
  cy.get('button[type="submit"]').click();
});
