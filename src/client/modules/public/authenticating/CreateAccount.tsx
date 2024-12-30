import { useState } from 'react';
import { trpcService } from '../../../trpcService/trpcClientService';
import { SimpleForm } from '../../../components/forms/SimpleForm';
import { InputField } from '../../../components/forms/InputField';
import { useFormState } from '../../../components/forms/utils/useFormState';
import { invalidateAuthCheckQuery } from '../../../trpcService/invalidateQueries';
import { VerifyAccountInstructions } from './VerifyAccountInstructions';

interface SubmitFormDataProps {
  email: string;
  name: string;
  password: string;
}

export function CreateAccount () {
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  
  const { 
    formData: { email, name, password }, 
    handleFieldChange 
  } = useFormState<SubmitFormDataProps>({ email: '', name: '', password: '' });

  const { mutate, error, isLoading } = trpcService.auth.createAccount.useMutation({
    onSuccess: async (data) => {
      if ( data?.success ) {
        await invalidateAuthCheckQuery();
        setAccountCreated(true);
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
      {!accountCreated && (
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

      {accountCreated && <VerifyAccountInstructions />}
    </>
  );
};
