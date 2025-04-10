import { useNavigate } from '@tanstack/react-router';
import { SYSTEM_STATUS } from '../../../server/systemStatus/types';
import { PageContent } from '../../widgets/PageContent';
import { ResendSuperAdminSetupEmailButton } from './authenticating/superAdminSetup/ResendSuperAdminSetupEmailButton';
import { ROUTE_URLS } from '../../routing/routeUrls';

interface Props {
  systemStatus: SYSTEM_STATUS;
}

export function SystemStatusNotification({ systemStatus }: Props) {
  const navigate = useNavigate();

  if (systemStatus !== SYSTEM_STATUS.IN_PROGRESS) {
    return <></>;
  }

  return (
    <div
      className="bg-red-900 text-white"
      data-testid="sytem-status-notification"
    >
      <PageContent className="py-1">
        <div>
          Your app is almost ready to launch. Check your email to complete your
          admin account setup.{' '}
          <ResendSuperAdminSetupEmailButton
            type="inline"
            onResendError={() => {
              navigate({ to: ROUTE_URLS.superAdminSetupFailed });
            }}
          />
        </div>
      </PageContent>
    </div>
  );
}
