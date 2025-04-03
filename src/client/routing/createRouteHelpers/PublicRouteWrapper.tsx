import { useLoaderData } from '@tanstack/react-router';
import { PublicApp } from '../../modules/public/PublicApp';

interface PublicRouteWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ComponentType<any>;
  path: string;
}

export function PublicRouteWrapper(props: PublicRouteWrapperProps) {
  const { children: UserComponent, path } = props;
  const { appState } = useLoaderData({ from: path });
  return (
    <PublicApp appState={appState.appState}>
      <UserComponent />
    </PublicApp>
  );
}
