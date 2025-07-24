describe('SendGrid API Email Integration Tests', () => {
  const testUser = {
    name: 'sendgridtestuser',
    email: `sendgrid.testuser+${Cypress._.random(0, 1e9)}@example.com`,
    password: 'SendGridPassword123!',
  };

  before(() => {
    cy.verifyTestEnvironment();
    cy.cleanupTestUsers();
  });

  beforeEach(() => {
    cy.log('Before intercept setup');
    // Access the expected API key and system email from Cypress environment variables
    // (Ensure these are exposed to Cypress, e.g., via cypress.config.ts 'env' or direct CLI)
    const expectedSendgridApiKey = Cypress.env('EMAIL_SERVICE_PASS');
    const expectedSystemEmailAddress = Cypress.env(
      'EMAIL_SERVICE_SYSTEM_EMAIL_ADDRESS'
    );
    const expectedSystemEmailSender = Cypress.env(
      'EMAIL_SERVICE_SYSTEM_EMAIL_SENDER'
    ); // If you want to check sender name too

    cy.intercept('POST', 'https://api.sendgrid.com/v3/mail/send', (req) => {
      // --- 1. Assertions on the Request (What your app sent to SendGrid) ---

      // Assert on the Authorization header to verify the API key
      expect(req.headers.authorization).to.exist;
      expect(req.headers.authorization).to.include(
        'Bearer ',
        'Authorization header must start with Bearer'
      );
      // Crucial: Verify that the expected API key is part of the Bearer token
      expect(req.headers.authorization).to.eq(
        `Bearer ${expectedSendgridApiKey}`,
        'Authorization header must contain the correct SendGrid API Key'
      );

      // Assert on the request body (the actual email payload)
      expect(req.body).to.exist;
      expect(req.body.personalizations)
        .to.be.an('array')
        .and.have.lengthOf.at.least(
          1,
          'Email must have at least one personalization'
        );
      expect(req.body.personalizations[0].to)
        .to.be.an('array')
        .and.have.lengthOf.at.least(
          1,
          'Personalization must have at least one recipient'
        );

      // Make these the default, active assertions:
      expect(req.body.personalizations[0].to[0].email).to.eq(
        testUser.email,
        'Recipient email matches test user'
      );
      expect(req.body.subject).to.include(
        'Welcome',
        'Subject contains "Welcome" for registration email'
      );
      // Assuming your welcome email's HTML body contains this specific phrase:
      expect(req.body.html).to.include(
        'Welcome to our service',
        'HTML body contains welcome message'
      );

      // Assert on the 'from' email and optionally the 'from' name
      expect(req.body.from).to.exist;
      expect(req.body.from.email).to.eq(
        expectedSystemEmailAddress,
        'Sender email matches system email address'
      );
      if (expectedSystemEmailSender) {
        // Only check if sender name is configured and relevant
        expect(req.body.from.name).to.eq(
          expectedSystemEmailSender,
          'Sender name matches system email sender name'
        );
      }

      // --- 2. Mocking the Response (What SendGrid would send back) ---

      // Simulate a successful SendGrid API response (HTTP 202 Accepted)
      req.reply({
        statusCode: 202, // SendGrid returns 202 for successful asynchronous send
        headers: {
          'Content-Type': 'application/json',
          'X-Message-Id': `mock-sendgrid-msg-${Cypress._.random(0, 1e6)}`, // Mock a unique message ID
        },
        body: {}, // SendGrid's 202 response usually has an empty body
      });
    }).as('sendgridMailSend'); // Give this intercept an alias for waiting later
  });

  it('sends a welcome email via SendGrid API on successful user registration', () => {
    cy.createAccountAttempt({ demoUser: testUser });
    cy.url().should('include', '/dashboard');
    cy.wait('@sendgridMailSend').then((interception) => {
      cy.log('SendGrid API call intercepted and verified.');
      expect(interception.response.statusCode).to.eq(
        202,
        'Mock SendGrid response should be 202'
      );
    });
  });
});
