// interface Props {

import { useNavigate } from "@tanstack/react-router";
import { trpcService } from "../../../../trpcService/trpcClientService";
import { InputField } from "../../../../widgets/forms/InputField";
import { SimpleForm } from "../../../../widgets/forms/SimpleForm";
import { useFormState } from "../../../../widgets/forms/utils/useFormState";
import { ROUTE_URLS } from "../../../../routing/routeUrls";
import { PASSWORD_RESET_SUCCESS } from "../../../../../utils/messageCodes";

interface ResetPasswordEmailFormProps {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm ({ userId }: { userId: string; }) {
  const navigate = useNavigate();

  const {
    formData: { password, confirmPassword },
    handleFieldChange
  } = useFormState<ResetPasswordEmailFormProps>({ password: '', confirmPassword: '' });
  
  const { mutate, error, isLoading } = trpcService.auth.resetPassword.useMutation({
    onSuccess: () => {
      navigate({
        to: ROUTE_URLS.login,   
        search: { notification: PASSWORD_RESET_SUCCESS }
      });
    }
  });
  
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
              type="password"
              value={password}
              label="Password"
              onChange={handleFieldChange('password')}
              fieldErrors={fieldErrors?.password}
            />
            <InputField 
              name="confirmPassword"
              type="password"
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