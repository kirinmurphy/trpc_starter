const DEMO_USER = {
  name: 'Test User',
  email: 'testtt@gmail.com',
  password: 'P@ssword-123'
} as const; 

const publicHomepageIntroText = 'tRPC web app starter';

describe('User Authentication', () => {
  describe('Public Pages', () => {
    it('loads the public homepage', () => {
      cy.visit('/');
      cy.contains(publicHomepageIntroText, { timeout: 10000 }).should('be.visible');
    });
  
    it('redirects to / if visiting an authenticated route', () => {
      cy.visit('/home');
      cy.contains(publicHomepageIntroText, { timeout: 10000 }).should('be.visible');
    });
  });
  
  describe("Create Account", () => {
    before(() => {
      cy.verifyTestEnvironment();
      cy.cleanupTestUsers();  // in case prior tests don't complete
      cy.createAccountAndVerify({ demoUser: DEMO_USER });
    });
  
    after(() => {
      cy.cleanupTestUsers();
      cy.clearEmails();
    });
  
    describe('successful sign up', () => {
      it('renders the authenticated homepage and then successfully logs out ', () => {
        cy.contains(DEMO_USER.name).should('be.visible');
        cy.contains(DEMO_USER.email).should('be.visible');

        cy.getStoredVerificationToken({ email: DEMO_USER.email }).should('exist').then(token => {
          cy.getLastEmail({ email: DEMO_USER.email }).then(emailAttempt => {
            expect(emailAttempt.Raw.To.includes(DEMO_USER.email)).to.equal(true);
            expect(emailAttempt.Content.Headers.Subject).to.include("Verify your email address");
            const emailBody =  emailAttempt.Content.Body;
            expect(emailBody).to.include(token);
            // TODO: Implement html parser to query more specific page elements 
            // const tokenUrl = `http://localhost/verify-account?token=${token}`;
          });  
        });

        cy.contains('button', 'Logout').click();
        cy.location('pathname').should('eq', '/');
      });
    });
  
    describe('sign up failure', () => {
      it('throws an error if user attempts to sign up with email already used', () => {
        cy.createAccountAttempt({ demoUser: DEMO_USER });
        cy.contains('An account with this email already exists.').should('be.visible');            
      });
    });
  });
  
  describe('Login', () => {
    before(() => {
      cy.createAccountAndVerify({ demoUser: DEMO_USER });    
      cy.contains('button', 'Logout').click();
    });
  
    after(() => {
      cy.cleanupTestUsers();
    });
  
    describe('login success', () => {
      beforeEach(() => {
        cy.login({ demoUser: DEMO_USER });
        cy.url().should('include', '/home');
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
          cy.wait(10000);
          cy.reload();
          cy.location('pathname').should('eq', '/');
        });
        
        it('remains at /home before token expiry', () => {
          cy.wait(6000);
          cy.reload();
          cy.location('pathname').should('eq', '/home');
        });
      });
    });
    
    describe('login error', () => {
      it('throws an error if user does not exist', () => {
        cy.login({ demoUser: { email: 'fake@email.com', password: 'someFakePassword' } });
        cy.contains('User not found').should('be.visible');            
      });
      
      it('throws an error if password is invalid', () => {
        cy.login({ demoUser: { ...DEMO_USER, password: 'someInvalidPassword' }});
        cy.contains('User not found').should('be.visible');            
      });
    });
  });
  
  describe("Account verification edge cases", () => {
    afterEach(() => {
      cy.cleanupTestUsers();
    });
  
    it('prompts user to resend verification email if token expired', () => {
      cy.createAccount({ demoUser: DEMO_USER });    
      cy.wait(16000);
      cy.getVerificationToken({ email: DEMO_USER.email }).should('exist').then(token => {
        cy.visit(`/verify-account?token=${token}`);
        cy.contains('Your verification code has expired.');
        cy.contains('Click here to request another verification link.');
        cy.contains('Resend verification email').click();
        cy.verifyAccount({ email: DEMO_USER.email });
      });
    });
  
    it('prompts user to resend verification email if logging in without verifying first', () => {
      cy.createAccount({ demoUser: DEMO_USER });    
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

    describe.only('email send failures', () => {
      beforeEach(() => {
        cy.resetMockEmailServer();
      });

      const emailSendFailureMessage = `We were unable to send your verification link to ${DEMO_USER.email}.`;

      it('fails to send email due to a connection error', () => {
        cy.simulateEmailErrors("connectionError");
        cy.createAccountAttempt({ demoUser: DEMO_USER });
        cy.contains(emailSendFailureMessage).should('be.visible');       
      });

      it('fails to send email due to an invalid email address', () => {
        cy.simulateEmailErrors("recipientError");
        cy.createAccountAttempt({ demoUser: DEMO_USER });
        cy.contains(emailSendFailureMessage).should('be.visible');
      });

      it('fails to send email due to a delivery timeout', () => {
        cy.simulateEmailErrors("deliveryError");
        cy.createAccountAttempt({ demoUser: DEMO_USER });
        cy.contains(emailSendFailureMessage).should('be.visible');       
      });
    });
  });
});

