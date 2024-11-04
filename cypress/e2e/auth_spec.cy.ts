const DEMO_USER = {
  name: 'Test User',
  email: 'testtt@gmail.com',
  password: 'P@ssword-123'
} as const; 

describe('Public Pages', () => {
  it('loads the public homepage', () => {
    cy.visit('/');
    cy.contains('Wilkommmen', { timeout: 10000 }).should('be.visible');
  });

  it('redirects to / if visiting an authenticated route', () => {
    cy.visit('/home');
    cy.contains('Wilkommmen', { timeout: 10000 }).should('be.visible');
  });
});

describe("Create Account", () => {
  before(() => {
    cy.verifyTestEnvironment();
    cy.cleanupTestUsers();  // in case prior tests don't complete
  });

  beforeEach(() => {
    cy.signUp({ demoUser: DEMO_USER });
  });

  afterEach(() => {
    cy.cleanupTestUsers();
  });

  describe('successful sign up', () => {
    it('renders the authenticated homepage', () => {
      cy.contains(DEMO_USER.name).should('be.visible');
      cy.contains(DEMO_USER.email).should('be.visible');
    });
    
    it('redirects back to / on logout', () => {
      cy.contains('button', 'Logout').click();
      cy.location('pathname').should('eq', '/');
    });
  });
});

describe('Loggin in', () => {
  before(() => {
    cy.signUp({ demoUser: DEMO_USER });    
    cy.contains('button', 'Logout').click();
  });

  beforeEach(() => {
    cy.login({ demoUser: DEMO_USER });
  });  

  after(() => {
    cy.cleanupTestUsers();
  });
  
  describe('Authenticated', () => {
    it('renders the authenticated homepage', () => {
      cy.contains(DEMO_USER.name).should('be.visible');
      cy.contains(DEMO_USER.email).should('be.visible');
    });
  
    it('redirects users from / to /home', () => {
      cy.visit('/');
      cy.url().should('include', '/home');
      cy.contains('Wilkommmen').should('not.exist');
    });

    it('redirects users from /login to /home', () => {
      cy.visit('/login');
      cy.url().should('include', '/home');
      cy.contains('Wilkommmen').should('not.exist');
    });
  });

  describe('token expiry', () => {
    it('redirects to / after token expired', () => {
      cy.wait(8000);
      cy.reload();
      cy.location('pathname').should('eq', '/');
    });

    it('remains at /home before token expiry', () => {
      cy.wait(5000);
      cy.reload();
      cy.location('pathname').should('eq', '/home');
    });
  });
});
