import { useEffect, useState } from 'react';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { Button, StyledButtonProps } from '../../../../widgets/Button';

interface Props {
  onResendError: () => void;
  onResendSuccess?: () => void;
  type?: StyledButtonProps['type'];
}

export function ResendSuperAdminSetupEmailButton(props: Props) {
  const { onResendSuccess, onResendError, type = undefined } = props;

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
        <Button onClick={handleResendEmail} disabled={isLoading} type={type}>
          {isLoading ? 'Sending...' : 'Resend verification email'}
        </Button>
      )}

      {emailSent && <strong>Email Sent</strong>}
    </>
  );
}
