import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  twc: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function Button({ children, twc, onClick }: ButtonProps) {
  return (
    <button
      className={`not-disabled:hover:text-white bg-linear-to-br cursor-pointer border-l border-t px-6 py-1.5 text-neutral-200 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 ${twc}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
