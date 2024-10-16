import { useNavigate } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../routing/routeUrls";

export function PublicHomepage () {
  const navigate = useNavigate();

  const handleLoginLink = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate({ to: ROUTE_URLS.login });
  }

  return (
    <>
      <div>Wilkommmen</div>
      <button onClick={handleLoginLink}>Login</button>
    </>
  );
}
