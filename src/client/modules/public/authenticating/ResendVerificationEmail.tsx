import { useState } from "react";
import { trpcService } from "../../../trpcService/trpcClientService";

export function ResendVerificationEmail (props: { userId: string; }) {
  const { userId } = props;
  const [emailWasSent, setEmailWasSent] = useState<boolean>(false);

  const resendEmailMutation = trpcService.auth.resendVerificationEmail.useMutation({
    onSuccess: async data => {
      setEmailWasSent(true);
      console.log('resendEmailMutationData', data);
    }
  });

  const handleResendEmail = async () => {
    try {
      await resendEmailMutation.mutate({ userId });
    } catch (err) {
      console.error('Error during resend email prompt: ', err);
    }
  }

  return (
    <>
      {!emailWasSent && (
        <>
          <div>Your verification code has expired. Click here to send another email.</div>
          <div>{userId}</div>
          <button onClick={handleResendEmail}>Resend email</button>
        </>
      )}

      {emailWasSent && (
        <div>Check your email.</div>
      )}
    </>
  );
}
