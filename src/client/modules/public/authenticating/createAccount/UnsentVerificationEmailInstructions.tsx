import { useState } from 'react';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { Button } from '../../../../widgets/Button';
import { LoginRedirectLink } from '../login/LoginRedirectLink';

interface Props {
  email: string;
  userId: string;
  onResendSuccess: () => void;
  loginRedirectOverride?: () => void;
}

const MAX_REQUESTS = 4;

const supportEmail = import.meta.env.VITE_EMAIL_ADDRESS_SUPPORT!;

export function UnsentVerificationEmailInstructions(props: Props) {
  const { email, userId, onResendSuccess, loginRedirectOverride } = props;

  const [resendRequestCount, setResendRequestCount] = useState<number>(0);

  const { mutate, isLoading } =
    trpcService.auth.resendFailedVerificationEmail.useMutation({
      onSuccess: (data) => {
        if (data?.success) {
          onResendSuccess();
        } else {
          setResendRequestCount((prev) => prev + 1);
        }
      },
      onError: () => {
        setResendRequestCount((prev) => prev + 1);
      },
    });

  const handleResendEmail = () => {
    try {
      mutate({ userId });
    } catch (err) {
      console.error('Mutation error: ', err);
    }
  };

  // TODO: should be able to handle with rate limiting
  const atResendLimit = resendRequestCount === MAX_REQUESTS;

  const loginLink = (
    <LoginRedirectLink loginRedirectOverride={loginRedirectOverride} />
  );

  return (
    <div className="text-center">
      <p className="text-xl">
        We were unable to send your verification link to {email}.
      </p>

      {!atResendLimit && (
        <>
          <p>
            This may be a problem with the connection or with the address
            provided.
          </p>

          <p>
            Try resending the email or {loginLink} later to request a new
            verification link.
          </p>

          <div className="pt-4 flex justify-center">
            <Button
              testId="resend-failed-verification-email-button"
              disabled={isLoading}
              onClick={handleResendEmail}
            >
              {isLoading ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        </>
      )}

      {atResendLimit && (
        <p className="max-w-[480px] mx-auto">
          It seems there is a continued connection problem, please {loginLink}{' '}
          later to request a new verification link.
        </p>
      )}

      <div className="max-w-[350px] mx-auto pt-10 pb-6">
        <hr></hr>
      </div>

      <p className="max-w-[350px] mx-auto text-sm">
        Is <b>{email}</b> the correct email address?
      </p>

      <p className="max-w-[360px] mx-auto text-sm">
        Contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a> if you're
        experiencing continued problems creating an account.
      </p>
    </div>
  );
}
