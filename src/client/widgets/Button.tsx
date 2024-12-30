import { MouseEvent } from "react";
import clsx from "clsx";

interface StyledButtonProps {
  children: string;
  disabled?: boolean;
  type?: 'inline';
  onClick?: (e: MouseEvent) => void;
}

export function StyledButton (props: StyledButtonProps) {
  const { 
    children, 
    onClick, 
    type = 'default',
    disabled 
  } = props;

  return (
    <button 
    type="button" 
      {...(onClick && { onClick })}
      className={clsx('', {
        'px-4 py-1 bg-gray-600 font-bold text-white ': type === 'default',
        'hover:bg-gray-200 hover:text-black': type === 'default' && !disabled,
        'opacity-50 cursor-default': type !== 'inline' && disabled,
        'underline': type === 'inline'
      })}
    >
      {children}
    </button>
  );
}


interface ButtonProps extends StyledButtonProps {
  onClick: (e: MouseEvent) => void;
}

export function Button (props: ButtonProps) {
  return <StyledButton {...props} />;
}
