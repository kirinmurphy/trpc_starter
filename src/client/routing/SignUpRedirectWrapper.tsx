import { useNavigate } from '@tanstack/react-router'
import { ROUTE_URLS } from './routeUrls';
import { SignUp } from '../modules/public/authenticating/SignUp';

export function SignUpRedirectWrapper () {
  const navigate = useNavigate();

  return (
    <SignUp onSignUpSuccess={() => {
      navigate({ to: ROUTE_URLS.verifyAccountInstructions })    
    }}/>    
  );
}
