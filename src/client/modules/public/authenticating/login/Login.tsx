import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ERR_ACCOUNT_NOT_VERIFIED } from '../../../../../utils/messageCodes';
import { trpcService } from '../../../../trpcService/trpcClientService';
import { invalidateAuthCheckQuery } from '../../../../trpcService/invalidateQueries';
import { SimpleForm } from '../../../../widgets/forms/SimpleForm';
import { InputField } from '../../../../widgets/forms/InputField';
import { useFormState } from '../../../../widgets/forms/utils/useFormState';
import { InlineNotification } from '../../../../widgets/InlineNotification/InlineNotification';
import { GetNewVerificationEmail } from '../createAccount/GetNewVerificationEmail';
import { ROUTE_URLS } from '../../../../routing/routeUrls';
import {
  loginNotifications,
  LoginNotificationType,
} from './loginNotifications';
import { useNotificationQueryParam } from '../../../../widgets/InlineNotification/useNotificationQueryParam';

interface LoginProps {
  onLoginSuccess?: () => void;
}

interface LoginFormProps {
  email: string;
  password: string;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [isUnverified, setIsUnverified] = useState(false);

  const notificationType = useNotificationQueryParam<LoginNotificationType>({
    from: ROUTE_URLS.login,
  });

  const {
    formData: { email, password },
    handleFieldChange,
  } = useFormState<LoginFormProps>({ email: '', password: '' });

  const { mutate, data, isLoading, error } = trpcService.auth.login.useMutation(
    {
      onSuccess: async (data) => {
        if (data?.success) {
          await invalidateAuthCheckQuery();
          if (onLoginSuccess) onLoginSuccess();
        } else if (data?.message === ERR_ACCOUNT_NOT_VERIFIED) {
          handleFieldChange('password')('');
          setIsUnverified(true);
        }
      },
    }
  );

  const onSubmit = () => {
    mutate({ email, password });
  };

  return (
    <>
      {!isUnverified && (
        <div className="max-w-md mx-auto">
          <SimpleForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            title="Login"
          >
            {({ fieldErrors }) => (
              <>
                <InlineNotification {...loginNotifications[notificationType]} />

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
          <div className="px-6 text-right">
            <Link to={ROUTE_URLS.requestResetPasswordEmail} preload={false}>
              Forgot password?
            </Link>
          </div>
        </div>
      )}

      {data && isUnverified && (
        <>
          <GetNewVerificationEmail
            userId={data.userId}
            loginRedirectOverride={() => {
              setIsUnverified(false);
            }}
          />
        </>
      )}
    </>
  );
}
