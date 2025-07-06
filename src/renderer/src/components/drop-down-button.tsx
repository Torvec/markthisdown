import { type ButtonProps } from "@renderer/types";

export default function DropDownButton({
  children,
  onClick,
  disabled = false,
}: ButtonProps): React.ReactElement {
  return (
    <button
      className="block w-full cursor-pointer px-4 py-2 text-neutral-300 transition-colors duration-300 ease-in-out hover:bg-neutral-900 hover:text-white"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
