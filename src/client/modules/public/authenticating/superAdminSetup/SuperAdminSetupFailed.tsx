import { ResendSuperAdminSetupEmailButton } from './ResendSuperAdminSetupEmailButton';

export function SuperAdminSetupFailed() {
  const handleResendError = () => {
    console.error("couldn't send that shizz");
  };
  return (
    <>
      <div>There was a problem setting up your email.</div>
      <ResendSuperAdminSetupEmailButton onResendError={handleResendError} />
    </>
  );
}
