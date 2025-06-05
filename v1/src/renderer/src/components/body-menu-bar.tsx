import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";

type BodyMenuBarProps = {
  handleClearBodyConfirm: () => void;
};

export default function BodyMenuBar({
  handleClearBodyConfirm,
}: BodyMenuBarProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const clearBodyDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs = {
    clearBody: clearBodyDropdownRef,
  };

  useDropdownClose({ openDropdown, dropdownRefs, setOpenDropdown });

  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="flex justify-between">
      <h2 className="bg-neutral-900 p-2 text-neutral-400">Body</h2>
      <div className="relative">
        <Button onClick={() => toggleDropdown("clearBody")} disabled={false}>
          Clear +
        </Button>
        {openDropdown === "clearBody" && (
          <DropDownMenu ref={clearBodyDropdownRef}>
            <DropDownButton
              onClick={() => {
                handleClearBodyConfirm();
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
