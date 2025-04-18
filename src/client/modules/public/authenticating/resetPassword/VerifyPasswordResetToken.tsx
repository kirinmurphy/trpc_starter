import { ResetPasswordForm } from './ResetPasswordForm';
import { ROUTE_URLS } from '../../../../routing/routeUrls';
import { ERR_VERIFICATION_TOKEN_EXPIRED } from '../../../../../utils/messageCodes';
import { VerifyUpdateToken } from '../VerifyUpdateToken';

export function VerifyPasswordResetToken() {
  return (
    <VerifyUpdateToken
      from={ROUTE_URLS.resetPassword}
      updateForm={ResetPasswordForm}
      tokenFailRedirect={{
        to: ROUTE_URLS.requestResetPasswordEmail,
        search: { notification: ERR_VERIFICATION_TOKEN_EXPIRED },
      }}
    />
  );
}
