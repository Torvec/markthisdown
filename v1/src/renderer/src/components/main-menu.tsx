import { useState, useRef, useEffect } from "react";
import Button from "./button";

interface MainMenuProps {
  fileInfo: { filename: string; filepath: string; showFileInFolderDisabled: boolean };
  setFileInfo: (info: {
    filename: string;
    filepath: string;
    showFileInFolderDisabled: boolean;
  }) => void;
  fmContent: string;
  setFmContent: (content: string) => void;
  bodyContent: string;
  setBodyContent: (content: string) => void;
}

function MainMenu({
  fileInfo,
  setFileInfo,
  fmContent,
  setFmContent,
  bodyContent,
  setBodyContent,
}: MainMenuProps): React.ReactElement {
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

  // Dropdown handlers
  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  // Button handlers
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleNewFileWithFm = () => console.log("Handled New File Trigger");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleNewFileNoFm = () => console.log("Handled New File Trigger");

  const handleOpenFileTrigger = async (): Promise<void> => {
    const openFileDialog = await window.electron.ipcRenderer.invoke("open-file-dialog");
    if (openFileDialog !== undefined) {
      setFileInfo({
        filename: openFileDialog.filename,
        filepath: openFileDialog.filepath,
        showFileInFolderDisabled: false,
      });
      setFmContent(openFileDialog.frontmatter);
      setBodyContent(openFileDialog.body);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOpenRecentTrigger = () => console.log("Handled Open Recent Trigger");

  const handleSaveAsTrigger = async (): Promise<void> => {
    const saveFileDialog = await window.electron.ipcRenderer.invoke(
      "save-file-dialog",
      fileInfo.filepath,
      combineEditorContent(),
    );
    if (saveFileDialog !== undefined) {
      setFileInfo({
        filename: saveFileDialog.filename,
        filepath: saveFileDialog.filepath,
        showFileInFolderDisabled: false,
      });
      setFmContent(saveFileDialog.frontmatter);
      setBodyContent(saveFileDialog.body);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSaveTrigger = () => console.log("Handled Save Trigger");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClearAllConfirm = () => console.log("Clear All Confirmed");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClearAllCancel = () => console.log("Clear All Canceled");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmBlockView = () => console.log("Block View clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmLineItemsView = () => console.log("Line Items View clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmHide = () => console.log("Hide clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmShow = () => console.log("Show clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmConfirmClear = () => console.log("Clear Confirm clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmCancelClear = () => console.log("Clear Cancel clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmConfirmRemove = () => console.log("Remove Confirm clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmCancelRemove = () => console.log("Remove Cancel clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmAdd = () => console.log("Add clicked");

  // Placeholder for recent files
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

  const combineEditorContent = (): string => {
    const trimFmContent = fmContent.trim() + "\n\n";
    const trimBodyContent = bodyContent.trim();
    return trimFmContent + trimBodyContent;
  };

  return (
    <nav className="flex items-center gap-0.5">
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
    </nav>
  );
}

export default MainMenu;
