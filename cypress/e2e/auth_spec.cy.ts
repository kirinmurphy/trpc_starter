const CURRENT_USER_EMAIL = 'mrnussbaum@gmail.com';
const CURRENT_USER_NAME = 'mister nussbaum';

describe('Public Pages', () => {
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
    cy.get('input[type="email"]').type(CURRENT_USER_EMAIL);
    cy.get('input[type="password"]').type('password1');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/home');
  });  
  
  describe('Authenticated', () => {
    it('Render the authenticated homepage', () => {
      cy.contains(CURRENT_USER_EMAIL).should('be.visible');
      cy.contains(CURRENT_USER_NAME).should('be.visible');
    });
  
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
      cy.wait(8000);
      cy.reload();
      cy.location('pathname').should('eq', '/');
      cy.contains('Wilkommmen').should('be.visible');
    });

    it('should remain on authenticated homepage before token expiry', () => {
      cy.wait(5000);
      cy.reload();
      cy.location('pathname').should('eq', '/home');
      });
  });
});
