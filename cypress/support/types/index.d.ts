export {};

declare global {
  namespace Cypress {
    interface Chainable {
      cleanupTestUsers(): Chainable<void>;
      verifyTestEnvironment(): Chainable<void>;
    }
  }
}
