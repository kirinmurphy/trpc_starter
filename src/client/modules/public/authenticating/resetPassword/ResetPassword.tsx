// interface Props {

import { trpcService } from "../../../../trpcService/trpcClientService";
import { InputField } from "../../../../widgets/forms/InputField";
import { SimpleForm } from "../../../../widgets/forms/SimpleForm";
import { useFormState } from "../../../../widgets/forms/utils/useFormState";

interface ResetPasswordEmailFormProps {
  password: string;
  confirmPassword: string;
}  
// TODO: this is not the top level route
// need to add VerifyResetPasswordToken component that checks the query param 
// if the token is verified, then the user can update their password 
export function ResetPassword () {
  const {
    formData: { password, confirmPassword },
    handleFieldChange
  } = useFormState<ResetPasswordEmailFormProps>({ password: '', confirmPassword: '' });
  
  const { data, mutate, error, isLoading } = trpcService.auth.requestResetPasswordEmail.useMutation({});
  
  const onSubmit = () => {
    if ( !password || !confirmPassword ) { return; }
    try {
      mutate({ password: password.trim(), confirmPassword: confirmPassword.trim() })
    } catch (err) {
      console.error('Mutation error:', err);
    }
  }

  return (
    <>
      <SimpleForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        title="Reset Password"
      >
        {({ fieldErrors }) => (
          <>
            <InputField 
              name="password"
              value={password}
              label="Password"
              onChange={handleFieldChange('password')}
              fieldErrors={fieldErrors?.password}
            />
            <InputField 
              name="confirmPassword"
              value={confirmPassword}
              label="Confirm Password"
              onChange={handleFieldChange('confirmPassword')}
              fieldErrors={fieldErrors?.confirmPassword}
            />
          </>
        )}
      </SimpleForm>
    </>
  );
}