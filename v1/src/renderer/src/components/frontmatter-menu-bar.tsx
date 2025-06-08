import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";
import {
  type FrontmatterMenuBarProps,
  type FrontmatterFormatType,
  type FrontmatterState,
} from "@renderer/types";

export default function FrontmatterMenuBar({
  defaults,
  frontmatter,
  setFrontmatter,
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

  //* FRONTMATTER HANDLERS
  const handleFmFormats = (format: FrontmatterFormatType): void => {
    setFrontmatter((prev) => ({
      ...prev,
      format: { type: format, delimiter: format === "yaml" ? "---" : "+++" },
    }));
  };

  const handleFmViewMode = (view: FrontmatterState["view"]): void => {
    setFrontmatter((prev) => ({
      ...prev,
      view: view,
      isVisible: prev.isVisible ? prev.isVisible : true,
    }));
  };

  const handleFmVisibility = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  };

  const handleFmClearConfirm = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      content: [["", ""]],
    }));
  };

  const handleFmDisableConfirm = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      isEnabled: false,
      isVisible: true,
      content: "",
    }));
  };

  const handleFmEnable = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      isEnabled: true,
      format: prev.format ? prev.format : defaults.fm.format,
      view: defaults.fm.view,
      content: defaults.fm.content,
    }));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-0.5">
        <h2 className="bg-neutral-900 p-2 text-neutral-400">Frontmatter</h2>
        <Button onClick={() => handleFmViewMode("edit")} disabled={!frontmatter.isEnabled}>
          Edit
        </Button>
        <Button onClick={() => handleFmViewMode("preview")} disabled={!frontmatter.isEnabled}>
          Preview
        </Button>
      </div>
      <div className="flex gap-0.5">
        <div className="relative">
          <Button onClick={() => toggleDropdown("formats")} disabled={!frontmatter.isEnabled}>
            Formats +
          </Button>
          {openDropdown === "formats" && (
            <DropDownMenu ref={formatsFmDropdownRef}>
              <DropDownButton
                onClick={() => {
                  handleFmFormats("yaml");
                  setOpenDropdown(null);
                }}
              >
                YAML ---
              </DropDownButton>
              <DropDownButton
                onClick={() => {
                  handleFmFormats("toml");
                  setOpenDropdown(null);
                }}
              >
                TOML +++
              </DropDownButton>
            </DropDownMenu>
          )}
        </div>
        <Button onClick={() => handleFmVisibility()} disabled={!frontmatter.isEnabled}>
          {frontmatter.isVisible ? "Hide" : "Show"}
        </Button>
        <div className="relative">
          <Button onClick={() => toggleDropdown("clear")} disabled={!frontmatter.isEnabled}>
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
          {frontmatter.isEnabled ? (
            <>
              <Button onClick={() => toggleDropdown("disable")} disabled={!frontmatter.isEnabled}>
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
            <Button onClick={handleFmEnable} disabled={frontmatter.isEnabled}>
              Enable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
