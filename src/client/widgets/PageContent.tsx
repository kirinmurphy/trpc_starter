import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: Props) {
  return (
    <div className={`${className} max-w-[1050px] mx-auto px-[4vw] py-2`}>
      {children}
    </div>
  );
}
