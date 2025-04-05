import { ROUTE_URLS } from '../../../../routing/routeUrls';
import { ERR_VERIFICATION_TOKEN_EXPIRED } from '../../../../../utils/messageCodes';
import { VerifyUpdateToken } from '../VerifyUpdateToken';
import { SuperAdminSetupForm } from './SuperAdminSetupForm';

export function VerifySuperAdminSetupToken() {
  return (
    <VerifyUpdateToken
      from={ROUTE_URLS.superAdminSetup}
      updateForm={SuperAdminSetupForm}
      tokenFailRedirect={{
        to: ROUTE_URLS.superAdminSetupFailed,
        search: { notification: ERR_VERIFICATION_TOKEN_EXPIRED },
      }}
    />
  );
}
