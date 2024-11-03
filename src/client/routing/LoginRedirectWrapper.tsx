import { useNavigate } from '@tanstack/react-router'
import { Login } from '../modules/authenticating/Login';
import { ROUTE_URLS } from './routeUrls';

export function LoginRedirectWrapper () {
  const navigate = useNavigate();

  return (
    <Login onLoginSuccess={() => {
      navigate({ to: ROUTE_URLS.authenticatedHomepage })    
    }}/>    
  );
}
