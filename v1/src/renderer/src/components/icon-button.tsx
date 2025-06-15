import { type ButtonProps } from "@renderer/types";

export default function IconButton({
  onClick,
  disabled = false,
  label,
  children,
}: ButtonProps & { label: string }): React.ReactElement {
  return (
    <button
      className="not-disabled:hover:text-white group relative mx-auto block cursor-pointer p-4 text-neutral-400 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute left-12 top-1/2 hidden -translate-y-1/2 border border-neutral-700 bg-black px-2 py-1 text-sm text-neutral-300 group-hover:block">
        {label}
      </span>
      {children}
    </button>
  );
}
