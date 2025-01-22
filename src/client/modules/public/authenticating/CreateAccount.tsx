import { useState } from 'react';
import { trpcService } from '../../../trpcService/trpcClientService';
import { SimpleForm } from '../../../widgets/forms/SimpleForm';
import { InputField } from '../../../widgets/forms/InputField';
import { useFormState } from '../../../widgets/forms/utils/useFormState';
import { VerifyAccountInstructions } from './VerifyAccountInstructions';
import { VerificationEmailNotSent } from './VerificationEmailNotSent';

interface SubmitFormDataProps {
  email: string;
  name: string;
  password: string;
}

type AccountCreationStateType = 'default' | 'emailNotSent' | 'emailSent';

export function CreateAccount () {
  const [accountCreationState, setAccountCreationState] = useState<AccountCreationStateType>('default');
  
  const { 
    formData: { email, name, password }, 
    handleFieldChange 
  } = useFormState<SubmitFormDataProps>({ email: '', name: '', password: '' });

  const { mutate, error, isLoading } = trpcService.auth.createAccount.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        const emailSent = data?.verificationEmailSendStatus.success;
        const newState = emailSent ? 'emailSent' : 'emailNotSent';
        setAccountCreationState(newState);
      }
    },
  });

  const onSubmit = () => {
    if ( !email || !password || !name ) { return; }

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
    <>
      {accountCreationState === 'default' && (
        <SimpleForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          title="Sign Up">
            {({ fieldErrors }) => (
              <>
                <InputField 
                  name="name" 
                  value={name}
                  label="Name" 
                  onChange={handleFieldChange('name')}
                  fieldErrors={fieldErrors?.name}
                />
                <InputField 
                  name="email" 
                  value={email}
                  label="Email" 
                  onChange={handleFieldChange('email')}
                  fieldErrors={fieldErrors?.email}
                />
                <InputField 
                  name="password" 
                  value={password}
                  label="Password" 
                  onChange={handleFieldChange('password')}
                  fieldErrors={fieldErrors?.password}
                />              
              </>
            )}
        </SimpleForm>     
      )}

      {accountCreationState === 'emailSent' && <VerifyAccountInstructions />}

      {accountCreationState === 'emailNotSent' &&  (
        <VerificationEmailNotSent 
          email={email}
        />
      )} 
    </>
  );
};
