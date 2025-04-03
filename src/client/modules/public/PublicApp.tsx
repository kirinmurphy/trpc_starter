import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ROUTE_URLS } from '../../routing/routeUrls';
import { StyledButton } from '../../widgets/Button';
import { ActiveLink } from '../../widgets/ActiveLink';
import { SuperAdminDevAutoLogin } from './authenticating/SuperAdminDevAutoLogin';
import { APP_STATE } from '../../../server/appState/appState';

interface Props {
  children: ReactNode;
  appState: APP_STATE;
}

export function PublicApp({ children, appState }: Props) {
  console.log('appState', appState);

  return (
    <>
      <header className="flex py-4 mb-8 border-b border-gray-600">
        <div className="flex-grow">
          <Link to={ROUTE_URLS.publicHomepage} preload={false}>
            Home {appState}
          </Link>
        </div>

        <div>
          <div className="mb-2">
            <ActiveLink className="mr-2" to={ROUTE_URLS.login}>
              <StyledButton>LOGIN</StyledButton>
            </ActiveLink>

            <ActiveLink to={ROUTE_URLS.createAccount}>
              <StyledButton>SIGN UP</StyledButton>
            </ActiveLink>
          </div>
          <SuperAdminDevAutoLogin />
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}
