import { useState, useRef, useEffect } from "react";
import Button from "./button";

function MainMenu() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Create refs for each dropdown
  const newDropdownRef = useRef<HTMLDivElement>(null!);
  const recentDropdownRef = useRef<HTMLDivElement>(null!);
  const clearAllDropdownRef = useRef<HTMLDivElement>(null!);
  const clearFmDropdownRef = useRef<HTMLDivElement>(null!);
  const removeFmDropdownRef = useRef<HTMLDivElement>(null!);

  // Map dropdown keys to refs
  const dropdownRefs: Record<string, React.RefObject<HTMLDivElement>> = {
    new: newDropdownRef,
    recent: recentDropdownRef,
    clearAll: clearAllDropdownRef,
    clear: clearFmDropdownRef,
    remove: removeFmDropdownRef,
  };

  // Closes drop down menus if you click outside of them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  }, [openDropdown]);

  // Dropdown handlers
  const toggleDropdown = (id: string) => setOpenDropdown(openDropdown === id ? null : id);

  // Button handlers
  const handleNewFileWithFm = () => console.log("Handled New File Trigger");
  const handleNewFileNoFm = () => console.log("Handled New File Trigger");
  const handleOpenFileTrigger = () => console.log("Handled Open File Trigger");
  const handleOpenRecentTrigger = () => console.log("Handled Open Recent Trigger");
  const handleSaveAsTrigger = () => console.log("Handled Save As Trigger");
  const handleSaveTrigger = () => console.log("Handled Save Trigger");
  const handleClearAllConfirm = () => console.log("Clear All Confirmed");
  const handleClearAllCancel = () => console.log("Clear All Canceled");
  const handleFmBlockView = () => console.log("Block View clicked");
  const handleFmLineItemsView = () => console.log("Line Items View clicked");
  const handleFmHide = () => console.log("Hide clicked");
  const handleFmShow = () => console.log("Show clicked");
  const handleFmConfirmClear = () => console.log("Clear Confirm clicked");
  const handleFmCancelClear = () => console.log("Clear Cancel clicked");
  const handleFmConfirmRemove = () => console.log("Remove Confirm clicked");
  const handleFmCancelRemove = () => console.log("Remove Cancel clicked");
  const handleFmAdd = () => console.log("Add clicked");

  // Placeholder for recent files
  const recentFiles = [
    { label: "File1.md", onClick: () => console.log("Open File1.md") },
    { label: "File2.md", onClick: () => console.log("Open File2.md") },
  ];

  const DropDownMenu = ({
    ref,
    children,
  }: {
    ref: React.RefObject<HTMLDivElement>;
    children: React.ReactNode;
  }) => {
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
    <nav className="flex items-center gap-0.5">
      <span className="px-4 font-normal">File</span>
      {/* New */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("new")}>New</Button>
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
      <Button onClick={handleOpenFileTrigger}>Open</Button>

      {/* Recent */}
      <div className="relative">
        <Button
          onClick={() => {
            toggleDropdown("recent");
            handleOpenRecentTrigger();
          }}
        >
          Recent
        </Button>
        {openDropdown === "recent" && (
          <DropDownMenu ref={recentDropdownRef}>
            {recentFiles.map((file, idx) => (
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
      <Button onClick={handleSaveAsTrigger}>Save As</Button>

      {/* Save */}
      <Button onClick={handleSaveTrigger}>Save</Button>

      {/* Clear All */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("clearAll")}>Clear All</Button>
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
      <span className="px-4 font-normal">Frontmatter</span>
      {/* Block View */}
      <Button onClick={handleFmBlockView}>Block View</Button>

      {/* Line Items View */}
      <Button onClick={handleFmLineItemsView}>Line Items View</Button>

      {/* Hide */}
      <Button onClick={handleFmHide}>Hide</Button>

      {/* Show */}
      <Button onClick={handleFmShow}>Show</Button>

      {/* Clear */}
      <div className="relative">
        <Button onClick={() => toggleDropdown("clear")}>Clear</Button>
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
        <Button onClick={() => toggleDropdown("remove")}>Remove</Button>
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
      <Button onClick={handleFmAdd}>Add</Button>
    </nav>
  );
}

export default MainMenu;
