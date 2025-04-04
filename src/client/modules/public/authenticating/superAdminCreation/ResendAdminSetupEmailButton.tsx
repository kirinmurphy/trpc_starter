import { trpcService } from '../../../../trpcService/trpcClientService';
import { Button } from '../../../../widgets/Button';

interface Props {
  onResendError: () => void;
  onResendSuccess: () => void;
}

export function ResendAdminSetupEmailButton(props: Props) {
  const { onResendSuccess, onResendError } = props;

  const { mutate, isLoading } =
    trpcService.auth.resendSuperAdminSetupEmail.useMutation({
      onSuccess: onResendSuccess,
      onError: onResendError,
    });

  const handleResendEmail = () => {
    mutate();
  };

  return (
    <Button onClick={handleResendEmail} disabled={isLoading} type="inline">
      {isLoading ? 'Sending...' : 'Resend verification email'}
    </Button>
  );
}
