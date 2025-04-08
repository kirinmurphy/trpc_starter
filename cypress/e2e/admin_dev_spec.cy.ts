describe('Super Admin Auto Login', () => {
  it('auto logs into super admin account', () => {
    cy.visit('/login');
    cy.contains('button', 'SuperAdmin Login').click();
    cy.url().should('include', '/home');
    cy.contains('superadmin@local.dev');
  });
});
