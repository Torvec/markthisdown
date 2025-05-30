import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className={`not-disabled:hover:text-white not-disabled:hover:bg-neutral-600 cursor-pointer px-6 py-2 text-neutral-200 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-700`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
