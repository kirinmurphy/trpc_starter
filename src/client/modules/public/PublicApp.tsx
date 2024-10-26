import { Link } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../routing/routeUrls";

import { ReactNode } from "react";

export function PublicApp ({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex py-4 mb-8 border-b border-gray-600">
        <div className="flex-grow">
          <Link  to={ROUTE_URLS.publicHomepage} preload={false}>Home</Link>
        </div>
        
        <div>
          <Link className="mr-2" to={ROUTE_URLS.login} preload={false}>LOGIN</Link>
          <Link to={ROUTE_URLS.signUp} preload={false}>SIGN UP</Link>
        </div>
      </header>
      {children}
    </>
  )
}