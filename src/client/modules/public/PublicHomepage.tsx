import { Link } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../routing/routeUrls";

export function PublicHomepage () {

  return (
    <>
      <div>Wilkommmen</div>
      <Link to={ROUTE_URLS.login} preload={false}>LOGIN</Link>
    </>
  );
}
