import { MouseEvent } from "react";

interface ButtonProps {
  children: string;
  onClick: (e: MouseEvent) => void;
}

export function Button (props: ButtonProps) {
  const { children, onClick } = props;

  return (
    <button 
      type="button" 
      onClick={onClick}
      className={`
        px-4 py-1
        rounded-note
        bg-gray-600 font-bold text-white 
        hover:bg-gray-200 hover:text-black
      `}
    >
      {children}
    </button>
  );
}
