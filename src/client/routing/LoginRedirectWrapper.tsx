import { useNavigate } from '@tanstack/react-router';
import { Login } from '../modules/public/authenticating/login/Login';
import { ROUTE_URLS } from './routeUrls';

export function LoginRedirectWrapper() {
  const navigate = useNavigate();

  return (
    <>
      <Login
        onLoginSuccess={() => {
          navigate({ to: ROUTE_URLS.authenticatedHomepage });
        }}
      />
    </>
  );
}
