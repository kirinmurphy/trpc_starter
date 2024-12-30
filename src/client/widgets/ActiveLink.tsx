import { Link, useRouter } from "@tanstack/react-router";
import { ROUTE_URLS } from "../routing/routeUrls";

import { cloneElement, isValidElement, ReactElement, ReactNode } from "react";


interface DisableableComponent {
  disabled?: boolean;
}

interface Props {
  to: typeof ROUTE_URLS[keyof typeof ROUTE_URLS];
  children: ReactNode;
  className?: string;
}

export function ActiveLink ({ to, children, className }: Props) {
  const router = useRouter();
  const isCurrentRoute = router.state.location.pathname === to;

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
          ? cloneElement(children as ReactElement<DisableableComponent>, { 
            disabled: isCurrentRoute 
          }) 
          : children
        }
    </Link>
  );
}
