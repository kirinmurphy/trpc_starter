import { trpcService } from '../../../trpcService/trpcClientService';
import { SimpleForm } from '../../../components/forms/SimpleForm';
import { InputField } from '../../../components/forms/InputField';
import { useFormState } from '../../../components/forms/utils/useFormState';
import { invalidateAuthCheckQuery } from '../../../trpcService/invalidateQueries';

interface SignUpProps {
  onSignUpSuccess?: () => void;
}

interface SubmitFormDataProps {
  email: string;
  name: string;
  password: string;
}

export function SignUp ({ onSignUpSuccess }: SignUpProps) {
  const { 
    formData: { email, name, password }, 
    handleFieldChange 
  } = useFormState<SubmitFormDataProps>({ email: '', name: '', password: '' });

  const { mutate, error, isLoading } = trpcService.auth.signUp.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await invalidateAuthCheckQuery();
        if ( onSignUpSuccess ) onSignUpSuccess();
      } 
    },
  });

  const onSubmit = () => {
    try {
      mutate({ 
        email: email.trim(), 
        password: password.trim(), 
        name: name.trim() 
      });
    } catch (err) {
      console.error('Mutation error:', err);
    }
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
