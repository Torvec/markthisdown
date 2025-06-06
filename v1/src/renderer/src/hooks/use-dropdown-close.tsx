import { useEffect } from "react";
import { type UseDropdownCloseProps } from "@renderer/types";

export default function useDropdownClose({
  openDropdown,
  dropdownRefs,
  setOpenDropdown,
}: UseDropdownCloseProps): void {
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
  }, [openDropdown, dropdownRefs, setOpenDropdown]);
}
