import { useNavigate } from '@tanstack/react-router';
import { SYSTEM_STATUS } from '../../../server/systemStatus/types';
import { PageContent } from '../../widgets/PageContent';
import { ResendSuperAdminSetupEmailButton } from './authenticating/superAdminCreation/ResendSuperAdminSetupEmailButton';
import { ROUTE_URLS } from '../../routing/routeUrls';

interface Props {
  systemStatus: SYSTEM_STATUS;
}

export function SystemStatusNotification({ systemStatus }: Props) {
  const navigate = useNavigate();

  if (systemStatus !== SYSTEM_STATUS.IN_PROGRESS) {
    return <></>;
  }

  const resendEmailProps = {
    onResendError: () => {
      navigate({ to: ROUTE_URLS.superAdminSetupFail });
    },
  };

  return (
    <div className="bg-red-800 text-white">
      <PageContent className="py-1">
        <div className="">
          Your app is almost ready to launch. Check your email to complete your
          admin account setup.{' '}
          <ResendSuperAdminSetupEmailButton {...resendEmailProps} />
        </div>
      </PageContent>
    </div>
  );
}
