import { trpcService } from "../../../../trpcService/trpcClientService";
import { InputField } from "../../../../widgets/forms/InputField";
import { SimpleForm } from "../../../../widgets/forms/SimpleForm";
import { useFormState } from "../../../../widgets/forms/utils/useFormState";

const requestResetPasswordEmailCopy = {
  formPrompt: "We well send a confirmation email to this address:",
  customerSupportPrompt: "For "
}

interface RequestResetPasswordEmailFormPrompts {
  email: string;
}

export function RequestResetPasswordEmail () {
  const {
    formData: { email },
    handleFieldChange
  } = useFormState<RequestResetPasswordEmailFormPrompts>({ email: '' })

  const { data, mutate, error, isLoading } = trpcService.auth.requestResetPasswordEmail.useMutation({});

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
      <SimpleForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        title="Reset Password">
          {({ fieldErrors }) => (
            <>
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
      {data?.success && (
        <div>
          Please check {email} for instructions to reset your password.
        </div>
      )}
    </>
  )
}
