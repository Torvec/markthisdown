import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";

interface FrontmatterMenuBarProps {
  fmIsEnabled: boolean;
  fmIsVisible: boolean;
  handleFmViewMode: (view: "block" | "lineitems") => void;
  handleFmVisibility: () => void;
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

  const formatsFmDropdownRef = useRef<HTMLDivElement>(null!);
  const viewsFmDropdownRef = useRef<HTMLDivElement>(null!);
  const clearFmDropdownRef = useRef<HTMLDivElement>(null!);
  const disableFmDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs = {
    formats: formatsFmDropdownRef,
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
        <div className="relative">
          <Button onClick={() => toggleDropdown("formats")} disabled={!fmIsEnabled}>
            Formats +
          </Button>
          {openDropdown === "formats" && (
            <DropDownMenu ref={formatsFmDropdownRef}>
              <DropDownButton
                onClick={() => {
                  console.log("YAML Selected");
                  setOpenDropdown(null);
                }}
              >
                YAML ---
              </DropDownButton>
              <DropDownButton
                onClick={() => {
                  console.log("TOML Selected");
                  setOpenDropdown(null);
                }}
                disabled={true}
              >
                TOML +++
              </DropDownButton>
              <DropDownButton
                onClick={() => {
                  console.log("JSON Selected");
                  setOpenDropdown(null);
                }}
                disabled={true}
              >
                JSON {"{ }"}
              </DropDownButton>
            </DropDownMenu>
          )}
        </div>
        <div className="relative">
          <Button onClick={() => toggleDropdown("views")} disabled={!fmIsEnabled}>
            Views +
          </Button>
          {openDropdown === "views" && (
            <DropDownMenu ref={viewsFmDropdownRef}>
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
