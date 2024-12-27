import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { trpcService } from '../../../trpcService/trpcClientService';
import { invalidateAuthCheckQuery } from '../../../trpcService/invalidateQueries';
import { SimpleForm } from '../../../components/forms/SimpleForm';
import { InputField } from '../../../components/forms/InputField';
import { useFormState } from '../../../components/forms/utils/useFormState';
import { InlineNotification } from '../../../components/InlineNotification';
import { ResendVerificationEmail } from './ResendVerificationEmail';

const loginNotifications = {
  verification_failed: 'There was a problem verifying your account.  Login to request another verification email.'
} as const;

type LoginNotificationType = keyof typeof loginNotifications;

interface LoginProps {
  onLoginSuccess?: () => void;
}

interface LoginFormProps {
  email: string;
  password: string;
}

export function Login ({ onLoginSuccess }: LoginProps) {
  const [isUnverified, setIsUnverified] = useState(false);

  const search = useSearch({ from: '/login' });
  const notification = search.notification as LoginNotificationType;

  const { 
    formData: { email, password },
    handleFieldChange 
  } = useFormState<LoginFormProps>({ email: '', password: '' });

  const { mutate, data, isLoading, error } = trpcService.auth.login.useMutation({
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
        <>         

          <SimpleForm 
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            title="Login">

            <InlineNotification message={loginNotifications[notification]} />
  
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
        </>
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
