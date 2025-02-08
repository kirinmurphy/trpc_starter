import { useState } from "react";
import { trpcService } from "../../../../trpcService/trpcClientService";
import { InputField } from "../../../../widgets/forms/InputField";
import { SimpleForm } from "../../../../widgets/forms/SimpleForm";
import { useFormState } from "../../../../widgets/forms/utils/useFormState";
import { ERR_VERIFICATION_FAILED } from "../../../../../utils/messageCodes";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { useNotificationQueryParam } from "../../../../widgets/InlineNotification/useNotificationQueryParam";
import { InlineNotification } from "../../../../widgets/InlineNotification/InlineNotification";

const requestResetPasswordEmailCopy = {
  formPrompt: "We well send a confirmation email to this address:",
}

const verificationNotifications = {
  [ERR_VERIFICATION_FAILED]: {
    type: 'warning' as const,
    message: 'There was a problem verifying your account. If you think this is an error, please try again.'
  }
}

type VerificationNotificationType = keyof typeof verificationNotifications;

interface RequestResetPasswordEmailFormPrompts {
  email: string;
}

export function RequestResetPasswordEmail () {
  const notificationType = useNotificationQueryParam<VerificationNotificationType>({ 
    from: ROUTE_URLS.requestResetPasswordEmail 
  })

  const {
    formData: { email },
    handleFieldChange
  } = useFormState<RequestResetPasswordEmailFormPrompts>({ email: '' });

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const { data, mutate, error, isLoading } = trpcService.auth.requestResetPasswordEmail.useMutation({
    onSuccess: () => {
      setIsEmailSent(true);
    }
  });

  const onSubmit = () => {
    if ( !email ) { return; }
    try {
      mutate({ email: email.trim() });
    } catch (err) {
      console.error('Mutation error:', err);
    }
  };

  console.log('reset password data', data);

  return (
    <>
      {!isEmailSent && (
        <SimpleForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          title="Reset Password">
            {({ fieldErrors }) => (
              <>
                <InlineNotification {...verificationNotifications[notificationType]} />


                <div>{requestResetPasswordEmailCopy.formPrompt}</div>

                <InputField 
                  name="email"
                  value={email}
                  label="Email"
                  onChange={handleFieldChange('email')}
                  fieldErrors={fieldErrors?.email}
                />
              </>            
            )}
        </SimpleForm>
      )}
      {isEmailSent && (
        <div>
          <h2 className="text-xl mb-2">Thank you.</h2>
          <p className="max-w-[370px]">If there is an account associated with this email, we will send you a link to reset your password.</p>
        </div>
      )}
    </>
  )
}
