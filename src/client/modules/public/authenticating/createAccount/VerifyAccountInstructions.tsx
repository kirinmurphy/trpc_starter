import { LoginRedirectLink } from '../login/LoginRedirectLink';

interface Props {
  loginRedirectOverride?: () => void;
}

export function VerifyAccountInstructions({ loginRedirectOverride }: Props) {
  return (
    <div className="max-w-[600px] mx-auto text-center py-[4vw]">
      <p className="text-xl">
        We have sent a <b>verification link</b> to the email you provided.
      </p>
      <p>Please check your email and confirm your account to continue.</p>
      <div className="max-w-[500px] mx-auto px-8 py-4">
        <hr></hr>
      </div>

      <p className="max-w-[350px] mx-auto text-sm">
        If you are unable to access the verification email, please{' '}
        <LoginRedirectLink loginRedirectOverride={loginRedirectOverride} />{' '}
        again to request a new one.
      </p>
    </div>
  );
}
