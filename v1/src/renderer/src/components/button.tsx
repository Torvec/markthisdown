import { type ButtonProps } from "@renderer/types";

export default function Button({
  children,
  onClick,
  disabled = false,
}: ButtonProps): React.ReactElement {
  return (
    <button
      className="not-disabled:hover:text-white not-disabled:hover:bg-neutral-600 cursor-pointer bg-neutral-700 px-6 py-2 text-neutral-200 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
