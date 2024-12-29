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
      verifyAccount: (props: { email: string }) => Chainable<void>;
      signUpAndVerify: (props: AuthProps) => Chainable<void>;
      getVerificationToken: (options: { email: string }) => Chainable<string | null>;
      login: (props: AuthProps) => Chainable<void>;
    }
  }  
}
