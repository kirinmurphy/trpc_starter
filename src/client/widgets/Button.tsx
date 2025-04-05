import { MouseEvent } from 'react';
import clsx from 'clsx';

export interface StyledButtonProps {
  children: string | JSX.Element;
  disabled?: boolean;
  type?: 'inline';
  onClick?: (e: MouseEvent) => void;
  testId?: string;
}

export function StyledButton(props: StyledButtonProps) {
  const { children, onClick, type = 'default', testId, disabled } = props;

  const handleClick = (e: MouseEvent) => {
    if (disabled || !onClick) {
      return;
    }
    onClick(e);
  };

  return (
    <button
      type="button"
      {...(onClick && { onClick: handleClick })}
      {...(testId && { 'data-testid': testId })}
      className={clsx('', {
        'px-4 py-1 bg-gray-600 font-bold text-white ': type === 'default',
        'hover:bg-gray-200 hover:text-black': type === 'default' && !disabled,
        'opacity-50 cursor-default': type !== 'inline' && disabled,
        underline: type === 'inline',
      })}
    >
      {children}
    </button>
  );
}

interface ButtonProps extends StyledButtonProps {
  onClick: (e: MouseEvent) => void;
}

export function Button(props: ButtonProps) {
  return <StyledButton {...props} />;
}
