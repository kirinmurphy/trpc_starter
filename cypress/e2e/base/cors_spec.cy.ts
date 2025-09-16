const INVALID_ORIGINS = [
  'http://malicious-site.com',
  'http://localhost:8080',
  'https://evil.localhost',
  'https://evil.localhost:3000',
  'http://localhost.attacker.com',
  'http://127.0.0.1:3000',
  null,
];

describe('CORS Policy security', () => {
  describe('Invalid Origins', () => {
    INVALID_ORIGINS.forEach((origin) => {
      const originDisplay = origin || 'no origin header';

      it(`should reject requests from ${originDisplay}`, () => {
        makeRequestWithOrigin(origin).then((response) => {
          expect(response.headers).to.not.have.property(
            'access-control-allow-origin'
          );
          expect(response.headers).to.not.have.property(
            'access-control-allow-credentials'
          );
          expect(response.status).to.be.oneOf([401, 403]);
        });
      });
    });
  });
});

function makeRequestWithOrigin(origin) {
  const headers = origin ? { Origin: origin } : {};
  return cy.request({
    url: Cypress.config().baseUrl + '/api.auth.login',
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: {
      email: 'test@example.com',
      password: 'password123',
    },
    failOnStatusCode: false,
  });
}
