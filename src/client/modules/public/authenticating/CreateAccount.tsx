import { useState } from 'react';
import { EmailSentStatus } from '../../../../utils/types';
import { trpcService } from '../../../trpcService/trpcClientService';
import { SimpleForm } from '../../../widgets/forms/SimpleForm';
import { InputField } from '../../../widgets/forms/InputField';
import { useFormState } from '../../../widgets/forms/utils/useFormState';
import { VerifyAccountInstructions } from './VerifyAccountInstructions';
import { UnsentVerificationEmailInstructions } from './UnsentVerificationEmailInstructions';
import { CheckingEmailSent } from './CheckingIfEmailSent';

interface SubmitFormDataProps {
  email: string;
  name: string;
  password: string;
}

type AccountCreationStateType = 'default' | EmailSentStatus;

export function CreateAccount () {
  const [accountCreationState, setAccountCreationState] = useState<AccountCreationStateType>('default');
  
  const { 
    formData: { email, name, password }, 
    handleFieldChange 
  } = useFormState<SubmitFormDataProps>({ email: '', name: '', password: '' });

  const { data, mutate, error, isLoading } = trpcService.auth.createAccount.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) { 
        setAccountCreationState(EmailSentStatus.emailQueued); 
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

      {accountCreationState === EmailSentStatus.emailQueued && data && (
        <CheckingEmailSent 
          userId={data.userId} 
          onEmailChecked={state => {
            setAccountCreationState(state);
          }} 
        />
      )}

      {accountCreationState === EmailSentStatus.emailSent && (
        <VerifyAccountInstructions />
      )}

      {accountCreationState === EmailSentStatus.emailFailed && data && (
        <UnsentVerificationEmailInstructions 
          email={email} 
          userId={data.userId}
          onResendSuccess={() => { setAccountCreationState(EmailSentStatus.emailSent); }}
        />
      )} 
    </>
  );
};
