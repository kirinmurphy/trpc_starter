import { SYSTEM_STATUS } from '../../../server/systemStatus/types';
import { PageContent } from '../../widgets/PageContent';

interface Props {
  systemStatus: SYSTEM_STATUS;
}

export function SystemStatusNotification({ systemStatus }: Props) {
  if (systemStatus !== SYSTEM_STATUS.IN_PROGRESS) {
    return <></>;
  }

  return (
    <div className="bg-red-800 text-white">
      <PageContent className="py-1">
        <div className="text-center">
          Your app is almost ready to launch. Check your email to finish setting
          up your admin account.
        </div>
      </PageContent>
    </div>
  );
}
