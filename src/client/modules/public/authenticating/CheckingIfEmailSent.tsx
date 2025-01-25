import { EmailSentStatus } from "../../../../utils/types";
import { trpcService } from "../../../trpcService/trpcClientService";

interface Props {
  userId: string;
  onEmailChecked: (state: EmailSentStatus) => void;
}

export function CheckingEmailSent (props: Props) {
  const { userId, onEmailChecked } = props;

  trpcService.auth.getVerificationEmailSentStatus.useQuery({ userId }, { 
    cacheTime: 0, 
    staleTime: 0,
    onSuccess: data => {
      console.log('SUCCESS, data:', data);
      onEmailChecked(data);
    },
    onError: err => {
      console.log('Faaaillll, err:', err);
      onEmailChecked(EmailSentStatus.emailFailed)
    } 
  });

  return (
    <div className="text-center">
      Creating Your Account...
    </div>
  )
}
