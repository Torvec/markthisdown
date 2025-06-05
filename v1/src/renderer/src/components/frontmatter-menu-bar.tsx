import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";

type FrontmatterMenuBarProps = {
  fmIsEnabled: boolean;
  fmIsVisible: boolean;
  handleFmFormats: () => void;
  handleFmViewMode: (view: "edit" | "preview") => void;
  handleFmVisibility: () => void;
  handleFmClearConfirm: () => void;
  handleFmDisableConfirm: () => void;
  handleFmEnable: () => void;
};

export default function FrontmatterMenuBar({
  fmIsEnabled,
  fmIsVisible,
  handleFmFormats,
  handleFmViewMode,
  handleFmVisibility,
  handleFmClearConfirm,
  handleFmDisableConfirm,
  handleFmEnable,
}: FrontmatterMenuBarProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const formatsFmDropdownRef = useRef<HTMLDivElement>(null!);
  const clearFmDropdownRef = useRef<HTMLDivElement>(null!);
  const disableFmDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs = {
    formats: formatsFmDropdownRef,
    clear: clearFmDropdownRef,
    disable: disableFmDropdownRef,
  };

  useDropdownClose({ openDropdown, dropdownRefs, setOpenDropdown });

  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-0.5">
        <h2 className="bg-neutral-900 p-2 text-neutral-400">Frontmatter</h2>
        <Button onClick={() => handleFmViewMode("edit")}>Edit</Button>
        <Button onClick={() => handleFmViewMode("preview")}>Preview</Button>
      </div>
      <div className="flex gap-0.5">
        <div className="relative">
          <Button onClick={() => toggleDropdown("formats")} disabled={!fmIsEnabled}>
            Formats +
          </Button>
          {openDropdown === "formats" && (
            <DropDownMenu ref={formatsFmDropdownRef}>
              <DropDownButton
                onClick={() => {
                  handleFmFormats();
                  setOpenDropdown(null);
                }}
              >
                YAML ---
              </DropDownButton>
              <DropDownButton
                onClick={() => {
                  handleFmFormats();
                  setOpenDropdown(null);
                }}
              >
                TOML +++
              </DropDownButton>
            </DropDownMenu>
          )}
        </div>
        <Button onClick={() => handleFmVisibility()} disabled={!fmIsEnabled}>
          {fmIsVisible ? "Hide" : "Show"}
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
          {fmIsEnabled ? (
            <>
              <Button onClick={() => toggleDropdown("disable")} disabled={!fmIsEnabled}>
                Disable +
              </Button>
              {openDropdown === "disable" && (
                <DropDownMenu ref={disableFmDropdownRef}>
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
            </>
          ) : (
            <Button onClick={handleFmEnable} disabled={fmIsEnabled}>
              Enable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
