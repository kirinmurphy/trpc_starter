// interface Props {

import { trpcService } from "../../../../trpcService/trpcClientService";
import { InputField } from "../../../../widgets/forms/InputField";
import { SimpleForm } from "../../../../widgets/forms/SimpleForm";
import { useFormState } from "../../../../widgets/forms/utils/useFormState";

interface ResetPasswordEmailFormProps {
  password: string;
  confirmPassword: string;
}  


export function ResetPasswordForm ({ userId }: { userId: string; }) {
  const {
    formData: { password, confirmPassword },
    handleFieldChange
  } = useFormState<ResetPasswordEmailFormProps>({ password: '', confirmPassword: '' });
  
  const { mutate, error, isLoading } = trpcService.auth.resetPassword.useMutation();
  
  const onSubmit = () => {
    if ( !password || !confirmPassword ) { return; }
    try {
      mutate({ userId, password: password.trim(), confirmPassword: confirmPassword.trim() })
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