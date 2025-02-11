import { useState } from "react";
import { trpcService } from "../../../../trpcService/trpcClientService";
import { InputField } from "../../../../widgets/forms/InputField";
import { SimpleForm } from "../../../../widgets/forms/SimpleForm";
import { useFormState } from "../../../../widgets/forms/utils/useFormState";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { useNotificationQueryParam } from "../../../../widgets/InlineNotification/useNotificationQueryParam";
import { InlineNotification } from "../../../../widgets/InlineNotification/InlineNotification";
import { PasswordVerificationNotificationType, passwordVerificationNotifications } from "./requestPasswordNotifications";

const requestResetPasswordEmailCopy = {
  formPrompt: "We well send a confirmation email to this address:",
}

interface RequestResetPasswordEmailFormPrompts {
  email: string;
}

export function RequestResetPasswordEmail () {
  const notificationType = useNotificationQueryParam<PasswordVerificationNotificationType>({ 
    from: ROUTE_URLS.requestResetPasswordEmail 
  });

  const {
    formData: { email },
    handleFieldChange
  } = useFormState<RequestResetPasswordEmailFormPrompts>({ email: '' });

  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const { mutate, error, isLoading } = trpcService.auth.requestResetPasswordEmail.useMutation({
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
                <InlineNotification {...passwordVerificationNotifications[notificationType]} />

                <div>{requestResetPasswordEmailCopy.formPrompt}</div>

                <InputField 
                  name="email"
                  value={email}
                  label="Account Email"
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
