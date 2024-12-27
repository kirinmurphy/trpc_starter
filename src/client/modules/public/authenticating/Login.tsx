import { trpcService } from '../../../trpcService/trpcClientService';
import { invalidateAuthCheckQuery } from '../../../trpcService/invalidateQueries';
import { SimpleForm } from '../../../components/forms/SimpleForm';
import { InputField } from '../../../components/forms/InputField';
import { useFormState } from '../../../components/forms/utils/useFormState';
import { ResendVerificationEmail } from './ResendVerificationEmail';
import { useState } from 'react';

interface LoginProps {
  onLoginSuccess?: () => void;
}

interface LoginFormProps {
  email: string;
  password: string;
}

export function Login ({ onLoginSuccess }: LoginProps) {
  const [isUnverified, setIsUnverified] = useState(false);

  const { 
    formData: { email, password },
    handleFieldChange 
  } = useFormState<LoginFormProps>({ email: '', password: '' });

  const {mutate, data, isLoading, error } = trpcService.auth.login.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await invalidateAuthCheckQuery();
        if ( onLoginSuccess ) onLoginSuccess();
        // TODO: make message key a shared constant
      } else if ( data?.message === 'account_not_verified' ) {
        handleFieldChange('password')('');
        setIsUnverified(true);
      }
    },
  });

  const onSubmit = () => {
    mutate({ email, password });
  };

  return (
    <>
      {!isUnverified && (
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
      )}

      {data && isUnverified && (
        <>
          <ResendVerificationEmail 
            userId={data.userId} 
            loginRedirectOverride={() => { setIsUnverified(false); }} 
          />
        </>
      )}
    </>
  );
};
