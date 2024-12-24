import { trpcService } from '../../../trpcService/trpcClientService';
import { invalidateAuthCheckQuery } from '../../../trpcService/invalidateQueries';
import { SimpleForm } from '../../../components/forms/SimpleForm';
import { InputField } from '../../../components/forms/InputField';
import { useFormState } from '../../../components/forms/utils/useFormState';
import { useNavigate } from '@tanstack/react-router';
import { ROUTE_URLS } from '../../../routing/routeUrls';

interface LoginProps {
  onLoginSuccess?: () => void;
}

interface LoginFormProps {
  email: string;
  password: string;
}

export function Login ({ onLoginSuccess }: LoginProps) {

  const navigate = useNavigate();

  const { 
    formData: { email, password },
    handleFieldChange 
  } = useFormState<LoginFormProps>({ email: '', password: '' });

  const { mutate, isLoading, error } = trpcService.auth.login.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await invalidateAuthCheckQuery();
        if ( onLoginSuccess ) onLoginSuccess();
        // TODO: make message key a shared constant
      } else if ( data?.message === 'account_not_verified' ) {
        navigate({ to: ROUTE_URLS.verifyAccountInstructions });
      }
    },
  });

  const onSubmit = () => {
    mutate({ email, password });
  };

  return (
    <SimpleForm 
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      title="Login">

      <InputField 
        name="email" 
        value={email}
        label="Email" 
        onChange={handleFieldChange('email')}
      />
      <InputField 
        name="password" 
        value={password}
        label="Password" 
        onChange={handleFieldChange('password')}
      />
    </SimpleForm>
  );
};
