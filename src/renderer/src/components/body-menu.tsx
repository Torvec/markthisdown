import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import IconButton from "./icon-button";
import DropDownButton from "./drop-down-button";
import { Eraser } from "lucide-react";
import { type BodyMenuProps } from "@renderer/types";

export default function BodyMenu({ setBodyContent }: BodyMenuProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const clearBodyDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs = { clearBody: clearBodyDropdownRef };

  useDropdownClose({ openDropdown, dropdownRefs, setOpenDropdown });

  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="flex items-center justify-between">
      <h2 className="bg-neutral-900 p-2 text-neutral-400">Body</h2>
      <div className="relative">
        <IconButton onClick={() => toggleDropdown("clearBody")} label="Clear" labelPos="top">
          <Eraser />
        </IconButton>
        {openDropdown === "clearBody" && (
          <DropDownMenu ref={clearBodyDropdownRef}>
            <DropDownButton
              onClick={() => {
                setBodyContent("");
                setOpenDropdown(null);
              }}
            >
              Confirm
            </DropDownButton>
            <DropDownButton onClick={() => setOpenDropdown(null)}>Cancel</DropDownButton>
          </DropDownMenu>
        )}
      </div>
    </div>
  );
}
