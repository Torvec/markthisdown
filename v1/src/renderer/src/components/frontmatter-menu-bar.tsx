import { useState, useRef, useEffect } from "react";
import Button from "./button";

interface FrontmatterMenuBarProps {
  fmIsEnabled: boolean;
  fmViewMode: "block" | "lineitems";
  fmIsVisible: boolean;
  handleDelimiterSelect: (delimiter: "yaml" | "toml" | "json") => void;
  handleFmBlockView: () => void;
  handleFmLineItemsView: () => void;
  handleFmHide: () => void;
  handleFmShow: () => void;
  handleFmConfirmClear: () => void;
  handleFmConfirmRemove: () => void;
  handleFmAdd: () => void;
}

export default function FrontmatterMenuBar({
  fmIsEnabled,
  handleDelimiterSelect,
  fmViewMode,
  fmIsVisible,
  handleFmBlockView,
  handleFmLineItemsView,
  handleFmHide,
  handleFmShow,
  handleFmConfirmClear,
  handleFmConfirmRemove,
  handleFmAdd,
}: FrontmatterMenuBarProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const fmDelimitersDropdownRef = useRef<HTMLDivElement>(null!);
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
        <div className="relative">
          <Button onClick={() => toggleDropdown("delimiters")} disabled={!fmIsEnabled}>
            Delimiter
          </Button>
          {openDropdown === "delimiters" && (
            <DropDownMenu ref={fmDelimitersDropdownRef}>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  handleDelimiterSelect("yaml");
                  setOpenDropdown(null);
                }}
              >
                YAML ---
              </button>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  handleDelimiterSelect("toml");
                  setOpenDropdown(null);
                }}
              >
                TOML +++
              </button>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  handleDelimiterSelect("json");
                  setOpenDropdown(null);
                }}
              >
                JSON {"{"} {"}"}
              </button>
            </DropDownMenu>
          )}
        </div>
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
                  handleFmConfirmClear();
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
            Remove +
          </Button>
          {openDropdown === "remove" && (
            <DropDownMenu ref={clearFmDropdownRef}>
              <button
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  handleFmConfirmRemove();
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

        <Button onClick={handleFmAdd} disabled={fmIsEnabled}>
          Add
        </Button>
      </div>
    </div>
  );
}
