import { useEffect, useState } from 'react';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { Button } from '../../../../widgets/Button';

interface Props {
  onResendError: () => void;
  onResendSuccess?: () => void;
}

export function ResendSuperAdminSetupEmailButton(props: Props) {
  const { onResendSuccess, onResendError } = props;

  const [emailSent, setEmailSent] = useState<boolean>(false);

  useEffect(() => {
    if (emailSent && !onResendSuccess) {
      setTimeout(() => {
        setEmailSent(false);
      }, 20000);
    }
  }, [emailSent, onResendSuccess]);

  const { mutate, isLoading } =
    trpcService.auth.resendSuperAdminSetupEmail.useMutation({
      onSuccess: () => {
        setEmailSent(true);
        if (onResendSuccess) onResendSuccess();
      },
      onError: onResendError,
    });

  const handleResendEmail = () => {
    mutate();
  };

  return (
    <>
      {!emailSent && (
        <Button onClick={handleResendEmail} disabled={isLoading} type="inline">
          {isLoading ? 'Sending...' : 'Resend verification email'}
        </Button>
      )}

      {emailSent && <span>Email Sent</span>}
    </>
  );
}
