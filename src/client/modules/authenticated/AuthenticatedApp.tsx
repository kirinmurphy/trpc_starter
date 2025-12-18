import { Link } from '@tanstack/react-router';
import { trpcService } from '../../trpcService/trpcClientService';
import { ROUTE_URLS } from '../../routing/routeUrls';
import { LogoutButton } from './LogoutButton';
import { UserContext } from './UserContext';
import { PageContent } from '../../widgets/PageContent';

interface AuthenticatedAppProps {
  children: React.ReactNode;
}

export function AuthenticatedApp({ children }: AuthenticatedAppProps) {
  const { data: user, error } = trpcService.auth.getUser.useQuery(undefined, {
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (error) {
    console.error('failed to fetch user', error);
  }

  // TODO: Add system error handling
  if (!user) {
    return <></>;
  }

  return (
    <PageContent>
      <header className="flex pb-4 mb-8 border-b">
        <div className="flex-grow">
          <Link to={ROUTE_URLS.publicHomepage} preload={false}>
            Home
          </Link>
        </div>

        <div className="flex flex-col items-end">
          <div>{user.email}</div>
          <LogoutButton />
        </div>
      </header>

      <UserContext.Provider value={user}>
        <main>{children}</main>
      </UserContext.Provider>
    </PageContent>
  );
}
