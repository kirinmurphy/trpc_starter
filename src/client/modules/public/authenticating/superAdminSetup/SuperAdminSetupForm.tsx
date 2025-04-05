// interface Props {

import { useNavigate } from '@tanstack/react-router';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { InputField } from '../../../../widgets/forms/InputField';
import { SimpleForm } from '../../../../widgets/forms/SimpleForm';
import { useFormState } from '../../../../widgets/forms/utils/useFormState';
import { ROUTE_URLS } from '../../../../routing/routeUrls';
import { SUPER_ADMIN_SETUP_SUCCESS } from '../../../../../utils/messageCodes';

interface SuperAdminCreationFormProps {
  username: string;
  password: string;
  confirmPassword: string;
}

export function SuperAdminSetupForm({ userId }: { userId: string }) {
  const navigate = useNavigate();

  const {
    formData: { username, password, confirmPassword },
    handleFieldChange,
  } = useFormState<SuperAdminCreationFormProps>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { mutate, error, isLoading } =
    trpcService.auth.superAdminSetup.useMutation({
      onSuccess: () => {
        navigate({
          to: ROUTE_URLS.login,
          search: { notification: SUPER_ADMIN_SETUP_SUCCESS },
        });
      },
    });

  const onSubmit = () => {
    if (!password || !confirmPassword) {
      return;
    }
    try {
      mutate({
        username: username.trim(),
        userId,
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });
    } catch (err) {
      console.error('Mutation error:', err);
    }
  };

  return (
    <>
      <SimpleForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        title="Complete Account Setup"
      >
        {({ fieldErrors }) => (
          <>
            <InputField
              name="username"
              value={username}
              label="Name"
              onChange={handleFieldChange('username')}
              fieldErrors={fieldErrors?.username}
            />
            <InputField
              name="password"
              type="password"
              value={password}
              label="Password"
              onChange={handleFieldChange('password')}
              fieldErrors={fieldErrors?.password}
            />
            <InputField
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              label="Confirm Password"
              onChange={handleFieldChange('confirmPassword')}
              fieldErrors={fieldErrors?.confirmPassword}
            />
          </>
        )}
      </SimpleForm>
    </>
  );
}
