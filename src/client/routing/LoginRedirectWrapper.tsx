import { useNavigate } from '@tanstack/react-router'
import { ROUTE_URLS } from './routeUrls';
import { Login } from '../modules/authenticating/Login';

export function LoginRedirectWrapper () {
  const navigate = useNavigate();

  return (
    <Login onLoginSuccess={() => {
      console.log('HWOOOOO');
      navigate({ to: ROUTE_URLS.authenticatedHomepage })    
    }}/>    
  );
}
