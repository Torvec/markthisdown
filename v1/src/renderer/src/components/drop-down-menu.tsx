import { type DropDownMenuProps } from "@renderer/types";

export default function DropDownMenu({ children, ref }: DropDownMenuProps): React.ReactElement {
  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-10 min-w-max border border-neutral-600 bg-black"
    >
      {children}
    </div>
  );
}
