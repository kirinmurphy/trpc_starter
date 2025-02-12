import { useState } from 'react';
import { EmailSentStatus } from '../../../../../utils/types';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { Button } from '../../../../widgets/Button';
import { VerifyAccountInstructions } from './VerifyAccountInstructions';
import { LoginRedirectLink } from '../login/LoginRedirectLink';
import { UnsentVerificationEmailInstructions } from './UnsentVerificationEmailInstructions';

const userPromptCopy = {
  confirmedExpired: [
    'Your verification code has expired.',
    'Click here to request another verification link.',
  ],
  default: [
    'Your account is not yet verified.',
    'Check your email or request another verification link.',
  ],
};

interface GetNewVerificationEmailProps {
  userId: string;
  viewType?: keyof typeof userPromptCopy;
  loginRedirectOverride?: () => void;
}

export function GetNewVerificationEmail(props: GetNewVerificationEmailProps) {
  const { userId, viewType, loginRedirectOverride } = props;
  const [reRequestState, setReRequestState] = useState<EmailSentStatus | null>(
    null
  );

  const { data, mutate } = trpcService.auth.getNewVerificationEmail.useMutation(
    {
      onSuccess: async ({ emailSentStatus }) => {
        setReRequestState(emailSentStatus);
      },
      onError: () => {
        setReRequestState(EmailSentStatus.emailFailed);
      },
    }
  );

  const handleGetNewEmail = async () => {
    try {
      await mutate({ userId });
    } catch (err) {
      console.error('Error during resend email prompt: ', err);
    }
  };

  const [headlineText, instructionText] = userPromptCopy[viewType || 'default'];

  return (
    <div className="text-center">
      {!reRequestState && (
        <div className="max-w-[600px] mx-auto py-[4vw]">
          <p className="text-xl">{headlineText}</p>
          <p>{instructionText}</p>
          <div className="pt-4 flex justify-center">
            <Button onClick={handleGetNewEmail}>
              Resend verification email
            </Button>
          </div>
          <div className="max-w-[350px] mx-auto pt-10 pb-6">
            <hr></hr>
          </div>
          <p className="max-w-[350px] mx-auto text-sm">
            Return to{' '}
            <LoginRedirectLink loginRedirectOverride={loginRedirectOverride} />{' '}
            form.
          </p>
        </div>
      )}

      {reRequestState === EmailSentStatus.emailSent && (
        <VerifyAccountInstructions
          loginRedirectOverride={loginRedirectOverride}
        />
      )}

      {reRequestState === EmailSentStatus.emailFailed && data && (
        <UnsentVerificationEmailInstructions
          userId={userId}
          email={data.email}
          onResendSuccess={() => {
            setReRequestState(EmailSentStatus.emailSent);
          }}
          loginRedirectOverride={loginRedirectOverride}
        />
      )}
    </div>
  );
}
