// should match whats in superAdminDevFakeCredentials.ts
// to stay consistent with other tests
const MOCK_DEV_SUPER_ADMIN = {
  username: 'Dev Admin',
  email: 'superadmin@local.dev',
  password: 'Samsonite-123',
};

const inProgressNotification =
  'Your app is almost ready to launch. Check your email to complete your admin account setup.';

describe('test in progress systemStatus workflow ', () => {
  beforeEach(() => {
    cy.task('writeSystemStatusToInProgress');
  });

  afterEach(() => {
    cy.task('deleteMockPasswordTokens');
  });

  it('displays notification to complete admin setup', () => {
    cy.visit('/');
    cy.contains(inProgressNotification);
  });

  it('changes app systemStatus to ready on successful superAdmin setup submission', () => {
    const { username, password } = MOCK_DEV_SUPER_ADMIN;
    cy.task('getNewSuperAdminToken').then(({ token }) => {
      cy.visit(`/admin-setup?token=${token}`);
      cy.contains('Complete Account Setup').should('be.visible');
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('input[name="confirmPassword"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/login');
      cy.contains(inProgressNotification).should('not.exist');
    });
  });

  it('redirects to an admin-setup-fail page if token is invalid', () => {
    cy.visit(`/admin-setup?token=invalid-token-12345`);
    const failMsg =
      'We were unable to complete your admin account setup. You can request a new verification email and try again.';
    cy.contains(failMsg).should('be.visible');
    cy.get('[data-testid="sytem-status-notification"]').within(() => {
      cy.contains('Resend verification email');
    });
    cy.get('[data-testid="super-admin-failed"]').within(() => {
      cy.contains('Resend verification email');
    });
  });

  it('generates another reset token when Resend verification email is selected', () => {
    const { email } = MOCK_DEV_SUPER_ADMIN;
    cy.task('deleteMockPasswordTokens');
    cy.getPasswordResetToken({ email }).then((token) => {
      expect(token).to.equal(null);
    });

    cy.intercept('POST', '**/auth.verifySuperAdminSetupToken*').as(
      'verifyToken'
    );
    cy.visit('/');
    cy.contains('button', 'Resend verification email').click();
    cy.wait(500); // wait to make sure the token gets stored in the DB before checking
    cy.getPasswordResetToken({ email }).then((token) => {
      cy.visit(`/admin-setup?token=${token}`);
      cy.contains('Complete Account Setup').should('be.visible');
    });
  });
});
