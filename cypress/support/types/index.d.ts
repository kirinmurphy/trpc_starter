export {};

export interface AuthActionProps {
  demoUser: {
    name?: string;
    email: string;
    password: string;
  }
}

interface MailhogRecipient {
  Relays: null | string[];
  Mailbox: string;
  Domain: string;
  Params: string;
}

export interface MailhogEmailProps {
  ID: string;
  From: {
    Relays: null | string[];
    Mailbox: string;
    Domain: string;
    Params: string;
  };
  To: MailhogRecipient[];
  Content: {
    Headers: {
      'Content-Transfer-Encoding': string[];
      'Content-Type': string[];
      Date: string[];
      From: string[];
      'MIME-Version': string[];
      'Message-ID': string[];
      Received: string[];
      'Return-Path': string[];
      Subject: string[];
      To: string[];
    };
    Body: string;
    Size: number;
    MIME: null | string;
  };
  Created: string;
  MIME: null | string;
  Raw: {
    From: string;
    To: string[];
    Data: string;
    Helo: string;
    Subject: string;
  };
}


declare global {
  namespace Cypress {
    interface Chainable {
      cleanupTestUsers: () => Chainable<void>;
      verifyTestEnvironment: () => Chainable<void>;
      createAccountAttempt: (props: AuthActionProps) => Chainable<void>;
      createAccount: (props: AuthActionProps) => Chainable<void>;
      verifyAccount: (props: { email: string }) => Chainable<void>;
      signUpAndVerify: (props: AuthActionProps) => Chainable<void>;
      getVerificationToken: (options: { email: string }) => Chainable<string | null>;
      login: (props: AuthActionProps) => Chainable<void>;

      clearEmails: () => Chainable<void>;
      getLastEmail: (props: { email: string }) => Chainable<MailhogEmailProps>;
    }
  }  
}
