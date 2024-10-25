export {};

export interface AuthActionProps {
  demoUser: {
    name: string;
    email: string;
    password: string;
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      cleanupTestUsers: () => Chainable<void>;
      verifyTestEnvironment: () => Chainable<void>;
      signUp: (props: AuthProps) => Chainable<void>;
      login: (props: AuthProps) => Chainable<void>;
    }
  }
}
