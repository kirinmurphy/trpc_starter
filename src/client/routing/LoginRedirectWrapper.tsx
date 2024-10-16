import { useNavigate } from '@tanstack/react-router'
import { ROUTE_URLS } from './routeUrls';
import Login from '../components/auth/Login';

export function LoginRedirectWrapper () {
  const navigate = useNavigate();

  return (
    <Login onLoginSuccess={() => {
      navigate({ to: ROUTE_URLS.authenticatedHomepage })    
    }}/>    
  );
}
