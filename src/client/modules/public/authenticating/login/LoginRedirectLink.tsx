import { useNavigate } from "@tanstack/react-router";
import { Button } from "../../../../widgets/Button";
import { ROUTE_URLS } from "../../../../routing/routeUrls";

interface Props {
  loginRedirectOverride?: () => void;
}

export function LoginRedirectLink ({ loginRedirectOverride }: Props) {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    if ( loginRedirectOverride ) { loginRedirectOverride(); }
    else { navigate({ to: ROUTE_URLS.login }); }
  };

  return (
    <Button type="inline" onClick={handleLoginRedirect}>login</Button>    
  );
}
