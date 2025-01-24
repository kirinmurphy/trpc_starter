import { useState } from "react";
import { trpcService } from "../../../trpcService/trpcClientService";
import { Button } from "../../../widgets/Button";
import { VerifyAccountInstructions } from "./VerifyAccountInstructions";
import { LoginRedirectLink } from "./LoginRedirectLink";

const userPromptCopy = {
  confirmedExpired: ["Your verification code has expired.",  "Click here to request another verification link."],
  default: ["Your account is not yet verified.", "Check your email or request another verification link."]
};

interface GetNewVerificationEmailProps {
  userId: string;
  viewType?: keyof typeof userPromptCopy;
  loginRedirectOverride?: () => void;
}

export function GetNewVerificationEmail (props: GetNewVerificationEmailProps) {
  const { userId, viewType, loginRedirectOverride } = props;
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  
  const getNewEmailMutation = trpcService.auth.getNewVerificationEmail.useMutation({
    onSuccess: async () => { setRequestSubmitted(true); }
  });

  const handleGetNewEmail = async () => {
    try {
      await getNewEmailMutation.mutate({ userId });
    } catch (err) {
      console.error('Error during resend email prompt: ', err);
    }
  }

  const messages = userPromptCopy[viewType || 'default'];

  return (
    <div className="text-center">
      {!requestSubmitted && (
        <div className="max-w-[600px] mx-auto py-[4vw]">
          <p className="text-xl">{messages[0]}</p>
          <p>{messages[1]}</p>
          <div className="pt-4 flex justify-center">
            <Button onClick={handleGetNewEmail}>Resend verification email</Button>
          </div>
          <div className="max-w-[350px] mx-auto pt-10 pb-6">
            <hr></hr>
          </div>
          <p className="max-w-[350px] mx-auto text-sm"> 
            Return to <LoginRedirectLink loginRedirectOverride={loginRedirectOverride} /> form.
          </p>
        </div>
      )}

      {requestSubmitted && (
        <VerifyAccountInstructions 
          loginRedirectOverride={loginRedirectOverride}  
        />
      )}
    </div>
  );
}
