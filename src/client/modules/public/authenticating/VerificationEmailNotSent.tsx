import { trpcService } from "../../../trpcService/trpcClientService";
import { Button } from "../../../widgets/Button";
import { LoginRedirectLink } from "./LoginRedirectLink";

interface Props {
  email: string;
  userId: string;
  loginRedirectOverride?: () => void;
}

const supportEmail = import.meta.env.VITE_EMAIL_ADDRESS_SUPPORT || 'support@test.com';

export function VerificationEmailNotSent (props: Props) {

  const { email, userId, loginRedirectOverride } = props;

  const { mutate } = trpcService.auth.resendFailedVerificationEmail.useMutation({
    onSuccess: async () => {
      console.log('success');
    }
  });

  const handleResendEmail = () => {
    try {
      mutate({ userId });
    } catch (err) {
      console.error('Mutation error: ', err);
    }
  };

  return (
    <div>
      <p className="text-xl">We were unable to send your verification link to {email}.</p>
      
      <p>Try resending the email or <LoginRedirectLink loginRedirectOverride={loginRedirectOverride} /> later to request a new verification link.</p>

      <div className="pt-4 flex justify-center">
        <Button onClick={handleResendEmail}>Resend verification email</Button>
      </div>

      <div className="max-w-[350px] mx-auto pt-10 pb-6">
        <hr></hr>
      </div>

      <p className="max-w-[350px] mx-auto text-sm"> 
        Is <b>{email}</b> the correct email address?
      </p>

      <p className="max-w-[350px] mx-auto text-sm"> 
        Contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a> if you are experiencing continued problems creating an account.
      </p>
    </div>
  )
}
