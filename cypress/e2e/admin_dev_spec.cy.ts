describe('Super Admin Auto Login', () => {
  it('auto logs into super admin account', () => {
    cy.visit('/login');
    cy.contains('button', 'SuperAdmin Login').click();
    cy.url().should('include', '/home');
    cy.contains('superadmin@local.dev');
  });

  describe('app in ready state', () => {
    it('redirects /admin-setup to /', () => {
      cy.visit('/admin-setup');
      cy.location('pathname').should('equal', '/');
    });

    it('redirects /admin-setup-failed to /', () => {
      cy.visit('/admin-setup-failed');
      cy.location('pathname').should('equal', '/');
    });
  });
});
