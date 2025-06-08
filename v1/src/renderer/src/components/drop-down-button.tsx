import { type ButtonProps } from "@renderer/types";

export default function DropDownButton({
  children,
  onClick,
  disabled = false,
}: ButtonProps): React.ReactElement {
  return (
    <button
      className="not-disabled:hover:bg-neutral-900 w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out disabled:cursor-not-allowed disabled:text-white/50"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
