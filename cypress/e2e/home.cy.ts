
describe('Public Pages', () => {
  beforeEach(() => {
  });

  it('should load the public home page', () => {
    cy.visit('/');
    cy.contains('Wilkommmen', { timeout: 10000 }).should('be.visible');
  });

  it('redirect to the public homepage if going to logged in view when unauthenticated', () => {
    cy.visit('/home');
    cy.contains('Wilkommmen', { timeout: 10000 }).should('be.visible');
  });
});

describe('Loggin in', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('a', 'LOGIN').click();
    cy.get('input[type="email"]').type('mrnussbaum@gmail.com');
    cy.get('input[type="password"]').type('password1');
    cy.get('button[type="submit"]').click();
  });  
  
  it('should submit the login form', () => {
    cy.url().should('include', '/home');
    cy.contains('Welcome').should('be.visible');
  });

  describe('Authenticated', () => {
    it('should redirect back to authenticated homepage if authenticated user navigates to /', () => {
      cy.visit('/');
      cy.url().should('include', '/home');
      cy.contains('Wilkommmen').should('not.exist');
    });

    it('should redirect back to authenticated homepage if authenticated user navigates to /login', () => {
      cy.visit('/login');
      cy.url().should('include', '/home');
      cy.contains('Wilkommmen').should('not.exist');
    });
  });

  describe('token expiry', () => {
    it('should redirect to public homepage after token expired', () => {
      cy.wait(7000);
      cy.reload();
      cy.location('pathname').should('eq', '/');
      cy.contains('Wilkommmen').should('be.visible');
    });

    it('should remain on authenticated homepage before token expiry', () => {
      cy.wait(4000);
      cy.reload();
      cy.location('pathname').should('eq', '/home');
      cy.contains('Welcome').should('be.visible');
    });
  });
});
