
interface AuthenticatedAppProps {
  children: React.ReactNode;
}

export function AuthenticatedApp ({ children }:  AuthenticatedAppProps) {
  return (
    <>
      <div>Authed!</div>
      {children}
    </>
  ); 
}
