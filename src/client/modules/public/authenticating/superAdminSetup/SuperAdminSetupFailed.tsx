import { ResendSuperAdminSetupEmailButton } from './ResendSuperAdminSetupEmailButton';

export function SuperAdminSetupFailed() {
  const handleResendError = () => {
    console.error("couldn't send that shizz");
  };
  return (
    <div
      className="text-center max-w-[540px] mx-auto flex flex-col gap-5"
      data-testid="super-admin-failed"
    >
      <div>
        We were unable to complete your admin account setup. You can request a
        new verification email and try again.
      </div>

      <div className="mx-auto">
        <ResendSuperAdminSetupEmailButton onResendError={handleResendError} />
      </div>

      <div className="pt-2">
        <hr></hr>
      </div>

      <div>
        Please double check your SUPER_ADMIN_EMAIL variable to make sure you are
        sending the verification email to the right address.
      </div>

      <div className="text-sm">
        If you continue to face problems, please check the build logs and
        rebuild the application if necessary.
      </div>
    </div>
  );
}
