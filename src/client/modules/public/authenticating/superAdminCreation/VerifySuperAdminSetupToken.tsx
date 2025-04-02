import { ROUTE_URLS } from '../../../../routing/routeUrls';
import { ERR_VERIFICATION_TOKEN_EXPIRED } from '../../../../../utils/messageCodes';
import { SuperAdminCreationForm } from './SuperAdminCreationForm';
import { VerifyUpdateToken } from '../VerifyUpdateToken';

export function VerifySuperAdminSetupToken() {
  return (
    <VerifyUpdateToken
      from={ROUTE_URLS.superAdminSetup}
      updateForm={SuperAdminCreationForm}
      tokenFailRedirect={{
        to: ROUTE_URLS.superAdminSetupFail,
        search: { notification: ERR_VERIFICATION_TOKEN_EXPIRED },
      }}
    />
  );
}
