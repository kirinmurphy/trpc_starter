import { trpcService } from "../../../trpcService/trpcClientService";
import { Button } from "../../../widgets/Button";
import { LoginRedirectLink } from "./LoginRedirectLink";

interface Props {
  email: string;
  userId: string;
  onResendSuccess: () => void;
  loginRedirectOverride?: () => void;
}

const supportEmail = import.meta.env.VITE_EMAIL_ADDRESS_SUPPORT || 'support@test.com';

export function UnsentVerificationEmailInstructions (props: Props) {

  const { email, userId, onResendSuccess, loginRedirectOverride } = props;

  const { data, mutate, isLoading } = trpcService.auth.resendFailedVerificationEmail.useMutation({
    onSuccess: async () => {
      console.log('success');
      onResendSuccess();
    }
  });

  const handleResendEmail = () => {
    if ( isLoading ) { return; }

    try {
      mutate({ userId });
    } catch (err) {
      console.error('Mutation error: ', err);
    }
  };

  console.log('data', data);

  return (
    <div className="text-center">
      <p className="text-xl">We were unable to send your verification link to {email}.</p>
      
      <p>This may be a problem with the connection or with the address provided.</p>
      <p>Try resending the email or <LoginRedirectLink loginRedirectOverride={loginRedirectOverride} /> later to request a new verification link.</p>

      <div className="pt-4 flex justify-center">
        <Button disabled={isLoading} onClick={handleResendEmail}>
          {isLoading ? 'Sending...' : 'Resend verification email' }
        </Button>
      </div>

      <div className="max-w-[350px] mx-auto pt-10 pb-6">
        <hr></hr>
      </div>

      <p className="max-w-[350px] mx-auto text-sm"> 
        Is <b>{email}</b> the correct email address?
      </p>

      <p className="max-w-[360px] mx-auto text-sm"> 
        Contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a> if you're experiencing continued problems creating an account.
      </p>
    </div>
  )
}
