import { useState, useRef, useEffect } from "react";
import Button from "./button";

interface FileMenuBarProps {
  handleNewFileWithFm: () => void;
  handleNewFileNoFm: () => void;
  handleOpenFileTrigger: () => void;
  handleOpenRecentTrigger: () => void;
  handleSaveAsTrigger: () => void;
  handleSaveTrigger: () => void;
  handleClearAllConfirm: () => void;
  handleClearAllCancel: () => void;
}

export default function FileMenuBar({
  handleNewFileWithFm,
  handleNewFileNoFm,
  handleOpenFileTrigger,
  handleOpenRecentTrigger,
  handleSaveAsTrigger,
  handleSaveTrigger,
  handleClearAllConfirm,
  handleClearAllCancel,
}: FileMenuBarProps): React.ReactElement {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const newDropdownRef = useRef<HTMLDivElement>(null!);
  const recentDropdownRef = useRef<HTMLDivElement>(null!);
  const clearAllDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    new: newDropdownRef,
    recent: recentDropdownRef,
    clearAll: clearAllDropdownRef,
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

  const recentFiles = [
    { label: "File1.md", onClick: () => console.log("Open File1.md") },
    { label: "File2.md", onClick: () => console.log("Open File2.md") },
  ];

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
      <span className="px-4 font-normal">File</span>
      {/* New */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("new")} disabled={false}>
          New +
        </Button>
        {openDropdown === "new" && (
          <DropDownMenu ref={newDropdownRef}>
            <button
              className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
              onClick={() => {
                handleNewFileWithFm();
                setOpenDropdown(null);
              }}
            >
              With Frontmatter
            </button>
            <button
              className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
              onClick={() => {
                handleNewFileNoFm();
                setOpenDropdown(null);
              }}
            >
              No Frontmatter
            </button>
          </DropDownMenu>
        )}
      </div>

      {/* Open */}
      <Button onClick={handleOpenFileTrigger} disabled={false}>
        Open
      </Button>

      {/* Recent */}
      <div className="relative">
        <Button
          onClick={() => {
            toggleDropdown("recent");
            handleOpenRecentTrigger();
          }}
          disabled={false}
        >
          Recent +
        </Button>
        {openDropdown === "recent" && (
          <DropDownMenu ref={recentDropdownRef}>
            {recentFiles.map((file) => (
              <button
                key={file.label}
                className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
                onClick={() => {
                  file.onClick();
                  setOpenDropdown(null);
                }}
              >
                {file.label}
              </button>
            ))}
          </DropDownMenu>
        )}
      </div>

      {/* Save As */}
      <Button onClick={handleSaveAsTrigger} disabled={false}>
        Save As
      </Button>

      {/* Save */}
      <Button onClick={handleSaveTrigger} disabled={false}>
        Save
      </Button>

      {/* Clear All */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("clearAll")} disabled={false}>
          Clear All +
        </Button>
        {openDropdown === "clearAll" && (
          <DropDownMenu ref={clearAllDropdownRef}>
            <button
              className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
              onClick={() => {
                handleClearAllConfirm();
                setOpenDropdown(null);
              }}
            >
              Confirm
            </button>
            <button
              className="w-full cursor-pointer px-6 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-neutral-900"
              onClick={() => {
                handleClearAllCancel();
                setOpenDropdown(null);
              }}
            >
              Cancel
            </button>
          </DropDownMenu>
        )}
      </div>
    </>
  );
}
