import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";

interface FrontmatterMenuBarProps {
  fmIsEnabled: boolean;
  fmIsVisible: boolean;
  handleFmViewMode: (view: "block" | "lineitems") => void;
  handleFmVisibility: (visible: boolean) => void;
  handleFmClearConfirm: () => void;
  handleFmDisableConfirm: () => void;
  handleFmEnable: () => void;
}

export default function FrontmatterMenuBar({
  fmIsEnabled,
  fmIsVisible,
  handleFmViewMode,
  handleFmVisibility,
  handleFmClearConfirm,
  handleFmDisableConfirm,
  handleFmEnable,
}: FrontmatterMenuBarProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const viewsFmDropdownRef = useRef<HTMLDivElement>(null!);
  const clearFmDropdownRef = useRef<HTMLDivElement>(null!);
  const disableFmDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs = {
    views: viewsFmDropdownRef,
    clear: clearFmDropdownRef,
    disable: disableFmDropdownRef,
  };

  useDropdownClose({ openDropdown, dropdownRefs, setOpenDropdown });

  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div>
      <div className="w-max bg-neutral-900 px-4 py-1 font-normal text-neutral-400">Frontmatter</div>
      <div className="flex gap-0.5">
        <Button onClick={() => console.log("Formats Clicked")} disabled={true}>
          Formats +
        </Button>
        <div className="relative">
          <Button onClick={() => toggleDropdown("views")} disabled={!fmIsEnabled}>
            Views +
          </Button>
          {openDropdown === "views" && (
            <DropDownMenu ref={clearFmDropdownRef}>
              <DropDownButton
                onClick={() => {
                  handleFmViewMode("block");
                  setOpenDropdown(null);
                }}
              >
                Block
              </DropDownButton>
              <DropDownButton
                onClick={() => {
                  handleFmViewMode("lineitems");
                  setOpenDropdown(null);
                }}
              >
                Line Items
              </DropDownButton>
            </DropDownMenu>
          )}
        </div>

        <Button onClick={() => handleFmVisibility(false)} disabled={!fmIsEnabled || !fmIsVisible}>
          Hide
        </Button>

        <Button onClick={() => handleFmVisibility(true)} disabled={!fmIsEnabled || fmIsVisible}>
          Show
        </Button>

        <div className="relative">
          <Button onClick={() => toggleDropdown("clear")} disabled={!fmIsEnabled}>
            Clear +
          </Button>
          {openDropdown === "clear" && (
            <DropDownMenu ref={clearFmDropdownRef}>
              <DropDownButton
                onClick={() => {
                  handleFmClearConfirm();
                  setOpenDropdown(null);
                }}
              >
                Confirm
              </DropDownButton>
              <DropDownButton onClick={() => setOpenDropdown(null)}>Cancel</DropDownButton>
            </DropDownMenu>
          )}
        </div>

        <div className="relative">
          <Button onClick={() => toggleDropdown("disable")} disabled={!fmIsEnabled}>
            Disable +
          </Button>
          {openDropdown === "disable" && (
            <DropDownMenu ref={clearFmDropdownRef}>
              <DropDownButton
                onClick={() => {
                  handleFmDisableConfirm();
                  setOpenDropdown(null);
                }}
              >
                Confirm
              </DropDownButton>
              <DropDownButton onClick={() => setOpenDropdown(null)}>Cancel</DropDownButton>
            </DropDownMenu>
          )}
        </div>

        <Button onClick={handleFmEnable} disabled={fmIsEnabled}>
          Enable
        </Button>
      </div>
    </div>
  );
}
