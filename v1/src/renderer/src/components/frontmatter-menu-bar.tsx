import { useState, useRef, useEffect } from "react";
import Button from "./button";

interface FrontmatterMenuBarProps {
  fmIsEnabled: boolean;
  fmViewMode: "block" | "lineitems";
  fmIsVisible: boolean;
  handleFmBlockView: () => void;
  handleFmLineItemsView: () => void;
  handleFmHide: () => void;
  handleFmShow: () => void;
  handleFmClearConfirm: () => void;
  handleFmDisableConfirm: () => void;
  handleFmEnable: () => void;
}

export default function FrontmatterMenuBar({
  fmIsEnabled,
  fmViewMode,
  fmIsVisible,
  handleFmBlockView,
  handleFmLineItemsView,
  handleFmHide,
  handleFmShow,
  handleFmClearConfirm,
  handleFmDisableConfirm,
  handleFmEnable,
}: FrontmatterMenuBarProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const clearFmDropdownRef = useRef<HTMLDivElement>(null!);
  const removeFmDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    clear: clearFmDropdownRef,
    remove: removeFmDropdownRef,
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        openDropdown &&
        dropdownRefs[openDropdown] &&
        dropdownRefs[openDropdown].current &&
        !dropdownRefs[openDropdown].current!.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  type DropDownMenuProps = { ref: React.RefObject<HTMLDivElement>; children: React.ReactNode };

  const DropDownMenu = ({ ref, children }: DropDownMenuProps): React.ReactElement => {
    return (
      <div
        ref={ref}
        className="absolute left-0 top-full z-10 min-w-max border border-neutral-500 bg-black"
      >
        {children}
      </div>
    );
  };

  return (
    <div>
      <div className="w-max bg-neutral-900 px-4 py-1 font-normal text-neutral-400">Frontmatter</div>
      <div className="flex gap-0.5">
        <Button onClick={handleFmBlockView} disabled={!fmIsEnabled || fmViewMode === "block"}>
          Block View
        </Button>

        <Button
          onClick={handleFmLineItemsView}
          disabled={!fmIsEnabled || fmViewMode === "lineitems"}
        >
          Line Items View
        </Button>

        <Button onClick={handleFmHide} disabled={!fmIsEnabled || !fmIsVisible}>
          Hide
        </Button>

        <Button onClick={handleFmShow} disabled={!fmIsEnabled || fmIsVisible}>
          Show
        </Button>

        <div className="relative">
          <Button onClick={() => toggleDropdown("clear")} disabled={!fmIsEnabled}>
            Clear +
          </Button>
          {openDropdown === "clear" && (
            <DropDownMenu ref={clearFmDropdownRef}>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  handleFmClearConfirm();
                  setOpenDropdown(null);
                }}
              >
                Confirm
              </button>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => setOpenDropdown(null)}
              >
                Cancel
              </button>
            </DropDownMenu>
          )}
        </div>

        <div className="relative">
          <Button onClick={() => toggleDropdown("remove")} disabled={!fmIsEnabled}>
            Disable +
          </Button>
          {openDropdown === "remove" && (
            <DropDownMenu ref={clearFmDropdownRef}>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  handleFmDisableConfirm();
                  setOpenDropdown(null);
                }}
              >
                Confirm
              </button>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => setOpenDropdown(null)}
              >
                Cancel
              </button>
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
