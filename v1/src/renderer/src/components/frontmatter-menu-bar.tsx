import { useState, useRef, useEffect } from "react";
import Button from "./button";

interface FrontmatterMenuBarProps {
  handleFmBlockView: () => void;
  handleFmLineItemsView: () => void;
  handleFmHide: () => void;
  handleFmShow: () => void;
  handleFmConfirmClear: () => void;
  handleFmCancelClear: () => void;
  handleFmConfirmRemove: () => void;
  handleFmCancelRemove: () => void;
  handleFmAdd: () => void;
}

export default function FrontmatterMenuBar({
  handleFmBlockView,
  handleFmLineItemsView,
  handleFmHide,
  handleFmShow,
  handleFmConfirmClear,
  handleFmCancelClear,
  handleFmConfirmRemove,
  handleFmCancelRemove,
  handleFmAdd,
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
    <>
      <span className="px-4 font-normal">Frontmatter</span>
      {/* Block View */}
      <Button onClick={handleFmBlockView} disabled={false}>
        Block View
      </Button>

      {/* Line Items View */}
      <Button onClick={handleFmLineItemsView} disabled={false}>
        Line Items View
      </Button>

      {/* Hide */}
      <Button onClick={handleFmHide} disabled={false}>
        Hide
      </Button>

      {/* Show */}
      <Button onClick={handleFmShow} disabled={false}>
        Show
      </Button>

      {/* Clear */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("clear")} disabled={false}>
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
              onClick={() => {
                handleFmCancelClear();
                setOpenDropdown(null);
              }}
            >
              Cancel
            </button>
          </DropDownMenu>
        )}
      </div>

      {/* Remove */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("remove")} disabled={false}>
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
              onClick={() => {
                handleFmCancelRemove();
                setOpenDropdown(null);
              }}
            >
              Cancel
            </button>
          </DropDownMenu>
        )}
      </div>

      {/* Add */}
      <Button onClick={handleFmAdd} disabled={false}>
        Add
      </Button>
    </>
  );
}
