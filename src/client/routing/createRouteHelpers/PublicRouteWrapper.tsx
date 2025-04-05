import { useLoaderData } from '@tanstack/react-router';
import { PublicApp } from '../../modules/public/PublicApp';

interface PublicRouteWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ComponentType<any>;
  path: string;
  hideInProgressSystemNotification?: boolean;
}

export function PublicRouteWrapper(props: PublicRouteWrapperProps) {
  const {
    children: UserComponent,
    path,
    hideInProgressSystemNotification,
  } = props;
  const { appState } = useLoaderData({ from: path });
  return (
    <PublicApp
      systemStatus={appState.systemStatus}
      hideInProgressSystemNotification={hideInProgressSystemNotification}
    >
      <UserComponent />
    </PublicApp>
  );
}
