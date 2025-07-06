import { useState, useRef } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import IconButton from "./icon-button";
import DropDownButton from "./drop-down-button";
import { Pencil, View, FileText, Eye, EyeOff, Eraser, FileX, FileSpreadsheet } from "lucide-react";
import {
  type FrontmatterMenuProps,
  type FrontmatterFormat,
  type FrontmatterState,
} from "@renderer/types";

export default function FrontmatterMenu({
  defaults,
  frontmatter,
  setFrontmatter,
}: FrontmatterMenuProps): React.ReactElement {
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
  const handleFmFormats = (format: FrontmatterFormat["type"]): void => {
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
      <div className="flex items-center gap-2">
        <h2 className="bg-neutral-900 p-2 text-neutral-400">Frontmatter</h2>
        <IconButton
          onClick={() => handleFmViewMode("edit")}
          disabled={!frontmatter.isEnabled}
          label="Edit"
          labelPos="top"
        >
          <Pencil />
        </IconButton>
        <IconButton
          onClick={() => handleFmViewMode("preview")}
          disabled={!frontmatter.isEnabled}
          label="Preview"
          labelPos="top"
        >
          <View />
        </IconButton>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <IconButton
            onClick={() => toggleDropdown("formats")}
            disabled={!frontmatter.isEnabled}
            label="Formats"
            labelPos="top"
          >
            <FileText />
          </IconButton>
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
        <IconButton
          onClick={() => handleFmVisibility()}
          disabled={!frontmatter.isEnabled}
          label={frontmatter.isVisible ? "Hide" : "Show"}
          labelPos="top"
        >
          {frontmatter.isVisible ? <EyeOff /> : <Eye />}
        </IconButton>
        <div className="relative">
          <IconButton
            onClick={() => toggleDropdown("clear")}
            disabled={!frontmatter.isEnabled}
            label="Clear"
            labelPos="top"
          >
            <Eraser />
          </IconButton>
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
              <IconButton
                onClick={() => toggleDropdown("disable")}
                disabled={!frontmatter.isEnabled}
                label="Disable"
                labelPos="top"
              >
                <FileX />
              </IconButton>
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
            <IconButton onClick={handleFmEnable} label="Enable" labelPos="top">
              <FileSpreadsheet />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}
