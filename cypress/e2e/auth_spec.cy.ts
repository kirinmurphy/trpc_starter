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
    cy.signUpAndVerify({ demoUser: DEMO_USER });
  });

  afterEach(() => {
    cy.cleanupTestUsers();
  });

  describe('successful sign up', () => {
    it('renders the authenticated homepage and successfully logs out ', () => {
      cy.contains(DEMO_USER.name).should('be.visible');
      cy.contains(DEMO_USER.email).should('be.visible');
      cy.contains('button', 'Logout').click();
      cy.location('pathname').should('eq', '/');
    });
  });
});

describe('Loggin in', () => {
  before(() => {
    cy.signUpAndVerify({ demoUser: DEMO_USER });    
    cy.contains('button', 'Logout').click();
  });

  beforeEach(() => {
    cy.login({ demoUser: DEMO_USER });
    cy.url().should('include', '/home');
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

describe("Account verification edge cases", () => {
  afterEach(() => {
    cy.cleanupTestUsers();
  });

  it('prompts user to resend verification email if token expired', () => {
    cy.signUp({ demoUser: DEMO_USER });    
    cy.wait(4000);
    cy.getVerificationToken({ email: DEMO_USER.email }).should('exist').then(token => {
      cy.visit(`/verify-account?token=${token}`);
      cy.contains('Your verification code has expired.');
      cy.contains('Click here to request another verification link.');
      cy.contains('Resend verification email').click();
      cy.verifyAccount({ email: DEMO_USER.email });
    });
  });

  it('prompts user to resend verification email if logging in without verifying first', () => {
    cy.signUp({ demoUser: DEMO_USER });    
    cy.login({ demoUser: DEMO_USER });
    cy.contains('Your account is not yet verified.');
    cy.contains('Check your email or request another verification link.');
    cy.contains('Resend verification email');

  });

  it('redirects user to login page with notification if attempting to verify an invalid token', () => {
    cy.visit(`/verify-account?token=23ijook2j3FAKEFAKEk32jk3`);
    cy.contains('Verifying...').should('be.visible');
    cy.url().should('include', '/login');
    cy.contains('There was a problem verifying your account. Login to request another verification email.');
  });
});
