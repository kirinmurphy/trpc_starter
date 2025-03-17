import { useNavigate } from '@tanstack/react-router';
import { Login } from '../modules/public/authenticating/login/Login';
import { ROUTE_URLS } from './routeUrls';
import { SuperAdminDevAutoLogin } from '../modules/public/authenticating/SuperAdminDevAutoLogin';

export function LoginRedirectWrapper() {
  const navigate = useNavigate();

  return (
    <>
      <SuperAdminDevAutoLogin />
      <Login
        onLoginSuccess={() => {
          navigate({ to: ROUTE_URLS.authenticatedHomepage });
        }}
      />
    </>
  );
}
