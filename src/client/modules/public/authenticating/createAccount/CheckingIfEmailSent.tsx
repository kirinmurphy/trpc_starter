import { useEffect } from 'react';
import { EmailSentStatus } from '../../../../../utils/types';
import { trpcService } from '../../../../trpcService/trpcClientService';

interface Props {
  userId: string;
  onEmailChecked: (state: EmailSentStatus) => void;
}

export function CheckingEmailSent(props: Props) {
  const { userId, onEmailChecked } = props;

  const { data, error, isSuccess, isError } = trpcService.auth.getVerificationEmailSentStatus.useQuery(
    { userId },
    {
      gcTime: 0,
      staleTime: 0,
    }
  );

  useEffect(() => {
    if (isSuccess && data) {
      onEmailChecked(data);
    }
  }, [isSuccess, data, onEmailChecked]);

  useEffect(() => {
    if (isError) {
      onEmailChecked(EmailSentStatus.emailFailed);
    }
  }, [isError, error, onEmailChecked]);

  return <div className="text-center">Creating account...</div>;
}
