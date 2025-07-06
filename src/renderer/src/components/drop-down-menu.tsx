import { type DropDownMenuProps } from "@renderer/types";

export default function DropDownMenu({
  children,
  ref,
  pos = "bottom",
}: DropDownMenuProps): React.ReactElement {
  const position = {
    top: "left-1/2 bottom-full -translate-x-1/2",
    right: "right-full top-0",
    bottom: "left-1/2 top-full -translate-x-1/2",
    left: "left-full top-0",
  };
  return (
    <div
      ref={ref}
      className={`absolute ${position[pos]} z-10 w-max border border-neutral-600 bg-black`}
    >
      {children}
    </div>
  );
}
