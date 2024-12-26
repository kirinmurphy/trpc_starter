import { useState } from "react";
import { trpcService } from "../../../trpcService/trpcClientService";
import { Button } from "../../../components/Button";

export type ResendEmailViewType = 'confirmedExpired' | 'default'; 

const userPromptCopy: Record<ResendEmailViewType, string>  = {
  confirmedExpired: "Your verification code has expired.  Click here to request another verification email.",
  default: "Your account is not yet verified.  Please check your email or request another verification email message."
};

interface ResendVerificationEmailProps {
  userId: string;
  viewType?: ResendEmailViewType;
}

export function ResendVerificationEmail (props: ResendVerificationEmailProps) {
  const { userId, viewType } = props;
  const [emailWasSent, setEmailWasSent] = useState<boolean>(false);

  const resendEmailMutation = trpcService.auth.resendVerificationEmail.useMutation({
    onSuccess: async () => { setEmailWasSent(true); }
  });

  const handleResendEmail = async () => {
    try {
      await resendEmailMutation.mutate({ userId });
    } catch (err) {
      console.error('Error during resend email prompt: ', err);
    }
  }

  return (
    <div className="text-center">
      {!emailWasSent && (
        <>
          <p>{userPromptCopy[viewType || 'default']}</p>
          <div>
            <Button onClick={handleResendEmail}>Resend email</Button>
          </div>
        </>
      )}

      {emailWasSent && (
        <div>Check your email.</div>
      )}
    </div>
  );
}
