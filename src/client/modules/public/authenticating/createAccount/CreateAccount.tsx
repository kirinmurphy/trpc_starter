import { useState } from 'react';
import { EmailSentStatus } from '../../../../../utils/types';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { SimpleForm } from '../../../../widgets/forms/SimpleForm';
import { InputField } from '../../../../widgets/forms/InputField';
import { useFormState } from '../../../../widgets/forms/utils/useFormState';
import { VerifyAccountInstructions } from './VerifyAccountInstructions';
import { UnsentVerificationEmailInstructions } from './UnsentVerificationEmailInstructions';
import { CheckingEmailSent } from './CheckingIfEmailSent';

interface SubmitFormDataProps {
  email: string;
  userName: string;
  password: string;
}

type AccountCreationStateType = 'default' | EmailSentStatus;

export function CreateAccount() {
  const [accountCreationState, setAccountCreationState] =
    useState<AccountCreationStateType>('default');

  const {
    formData: { email, userName, password },
    handleFieldChange,
  } = useFormState<SubmitFormDataProps>({
    email: '',
    userName: '',
    password: '',
  });

  const { data, mutate, error, isLoading } =
    trpcService.auth.createAccount.useMutation({
      onSuccess: async (data) => {
        if (data?.success) {
          setAccountCreationState(EmailSentStatus.emailQueued);
        }
      },
    });

  const onSubmit = () => {
    if (!email || !password || !userName) {
      return;
    }
    try {
      mutate({
        email: email.trim(),
        password: password.trim(),
        // TODO PR: change to userName
        userName: userName.trim(),
      });
    } catch (err) {
      console.error('Mutation error:', err);
    }
  };

  return (
    <>
      {accountCreationState === 'default' && (
        <SimpleForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          title="Sign Up"
        >
          {({ fieldErrors }) => (
            <>
              <InputField
                name="userName"
                value={userName}
                label="Name"
                onChange={handleFieldChange('userName')}
                fieldErrors={fieldErrors?.userName}
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
                type="password"
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
          onEmailChecked={(state) => {
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
          onResendSuccess={() => {
            setAccountCreationState(EmailSentStatus.emailSent);
          }}
        />
      )}
    </>
  );
}
