import { type ButtonProps } from "@renderer/types";

export default function IconButton({
  onClick,
  disabled = false,
  label,
  labelPos = "left",
  children,
}: ButtonProps & {
  label: string;
  labelPos?: "top" | "right" | "bottom" | "left";
}): React.ReactElement {
  const pos = {
    top: "left-1/2 bottom-full -translate-x-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
    bottom: "left-1/2 top-full -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
  };
  return (
    <button
      className="not-disabled:hover:text-white group relative mx-auto block cursor-pointer p-2 text-neutral-400 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`absolute ${pos[labelPos]} z-10 hidden w-max border border-neutral-700 bg-black px-2 py-1 text-sm text-neutral-400 group-hover:block`}
      >
        {label}
      </span>
      {children}
    </button>
  );
}
