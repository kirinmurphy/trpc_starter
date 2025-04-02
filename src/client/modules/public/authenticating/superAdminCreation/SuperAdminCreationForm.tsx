// interface Props {

import { useNavigate } from '@tanstack/react-router';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { InputField } from '../../../../widgets/forms/InputField';
import { SimpleForm } from '../../../../widgets/forms/SimpleForm';
import { useFormState } from '../../../../widgets/forms/utils/useFormState';
import { ROUTE_URLS } from '../../../../routing/routeUrls';
import { SUPER_ADMIN_SETUP_SUCCESS } from '../../../../../utils/messageCodes';

interface SuperAdminCreationFormProps {
  userName: string;
  password: string;
  confirmPassword: string;
}

export function SuperAdminCreationForm({ userId }: { userId: string }) {
  const navigate = useNavigate();

  const {
    formData: { userName, password, confirmPassword },
    handleFieldChange,
  } = useFormState<SuperAdminCreationFormProps>({
    userName: '',
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
        userName: userName.trim(),
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
        title="Reset Password"
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
