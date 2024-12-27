import { MouseEvent } from "react";
import clsx from "clsx";


interface ButtonProps {
  children: string;
  type?: 'inline';
  onClick: (e: MouseEvent) => void;
}

export function Button (props: ButtonProps) {
  const { children, onClick, type = 'default' } = props;

  return (
    <button 
    type="button" 
      onClick={onClick}
      className={clsx('', {
        'px-4 py-1 bg-gray-600 font-bold text-white hover:bg-gray-200 hover:text-black': type === 'default',
        'underline': type === 'inline'
      })}
    >
      {children}
    </button>
  );
}
