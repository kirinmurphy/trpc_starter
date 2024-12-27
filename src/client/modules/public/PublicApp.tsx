import { Link, useRouter } from "@tanstack/react-router";
import { ROUTE_URLS } from "../../routing/routeUrls";

import { cloneElement, isValidElement, ReactElement, ReactNode } from "react";
import { StyledButton } from "../../components/Button";

export function PublicApp ({ children }: { children: ReactNode }) {


  return (
    <>
      <header className="flex py-4 mb-8 border-b border-gray-600">
        <div className="flex-grow">
          <Link  to={ROUTE_URLS.publicHomepage} preload={false}>Home</Link>
        </div>
        
        <div>
          <DisableableLink 
            className="mr-2" 
            to={ROUTE_URLS.login}>
            <StyledButton>LOGIN</StyledButton>
          </DisableableLink>

          <DisableableLink 
            to={ROUTE_URLS.signUp}>
            <StyledButton>SIGN UP</StyledButton>
          </DisableableLink>
        </div>
      </header>
      <main>
        {children}
      </main>
    </>
  )
}

export interface DisableableComponent {
  disabled?: boolean;
}

interface Propss {
  to: typeof ROUTE_URLS[keyof typeof ROUTE_URLS];
  children: ReactNode;
  className?: string;
}

export function DisableableLink ({ to, children, className }: Propss) {
  const router = useRouter();
  const isCurrentRoute = router.state.location.pathname === to;

  

  console.log('isCurrentRoute', isCurrentRoute);

  return (
    <Link
      to={to}
      preload={false}
      className={className}
      onClick={(e) => {
        if ( isCurrentRoute) {
          e.preventDefault();
          return;
        }
      }}>
        {isValidElement(children) 
          ? cloneElement(children as ReactElement<DisableableComponent>, { disabled: isCurrentRoute }) 
          : children
        }
    </Link>
  );
}