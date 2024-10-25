import { trpcService } from '../../../utils/trpcClients';
import { invalidateAuthCheckQuery } from '../../../utils/invalidateQueries';
import { SimpleForm } from '../../components/forms/SimpleForm';
import { InputField } from '../../components/forms/InputField';
import { useFormState } from '../../components/forms/utils/useFormState';

interface LoginProps {
  onLoginSuccess?: () => void;
}

interface LoginFormProps {
  email: string;
  password: string;
}

export function Login ({ onLoginSuccess }: LoginProps) {
  const { 
    formData: { email, password },
    handleFieldChange 
  } = useFormState<LoginFormProps>({ email: '', password: '' });

  const { mutate, isLoading, error } = trpcService.auth.login.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await invalidateAuthCheckQuery();
        if ( onLoginSuccess ) onLoginSuccess();
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

export default Login;
