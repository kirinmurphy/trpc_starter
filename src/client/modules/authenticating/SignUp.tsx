import { useQueryClient } from '@tanstack/react-query';
import { trpcService } from '../../../utils/trpcClients';
import { SimpleForm } from '../../components/forms/SimpleForm';
import { InputField } from '../../components/forms/InputField';
import { useFormState } from '../../components/forms/utils/useFormState';

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

interface SubmitFormDataProps {
  email: string;
  name: string;
  password: string;
}

export function SignUp ({ onSignUpSuccess }: SignUpProps) {
  const queryClient = useQueryClient();

  const { 
    formData: { email, name, password }, 
    handleFieldChange 
  } = useFormState<SubmitFormDataProps>({ email: '', name: '', password: '' });

  const { mutate, error, isLoading } = trpcService.auth.signUp.useMutation({
    onSuccess: async (data) => {
      console.log('sign up data', data);
      if ( data?.success ) {
        // TODO: what other queries to invalidate 
        await queryClient.invalidateQueries(['auth', 'validateUser']);
        if ( onSignUpSuccess ) onSignUpSuccess();
      } 
    },
  });

  const onSubmit = () => {
    mutate({ 
      email: email.trim(), 
      password: password.trim(), 
      name: name.trim() 
    });
  }

  return (
    <SimpleForm 
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      title="Sign Up">

      <InputField 
        name="name" 
        value={name}
        label="Name" 
        onChange={handleFieldChange('name')}
      />
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

export default SignUp;
