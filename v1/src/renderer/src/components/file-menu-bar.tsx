import { useState, useRef, useEffect } from "react";
import Button from "./button";

interface FileMenuBarProps {
  handleNewFileWithFm: () => void;
  handleNewFileNoFm: () => void;
  handleOpenFileTrigger: () => void;
  handleOpenRecentFile: (filepath: string) => void;
  handleSaveAsTrigger: () => void;
  handleSaveTrigger: () => void;
  handleClearAllConfirm: () => void;
}

type RecentFile = { filename: string; filepath: string };

export default function FileMenuBar({
  handleNewFileWithFm,
  handleNewFileNoFm,
  handleOpenFileTrigger,
  handleOpenRecentFile,
  handleSaveAsTrigger,
  handleSaveTrigger,
  handleClearAllConfirm,
}: FileMenuBarProps): React.ReactElement {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
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

  useEffect(() => {
    if (openDropdown === "recent") {
      (async () => {
        const files = await window.electron.ipcRenderer.invoke("get-recent-files");
        setRecentFiles(files);
      })();
    }
  }, [openDropdown]);

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

  const RecentFilesListEmpty = (): React.ReactElement => {
    return <p className="text-center italic text-neutral-500">Recent Files List Empty</p>;
  };

  const RecentFilesList = (): React.ReactElement => {
    return (
      <>
        {recentFiles.map(({ filename, filepath }, index) => (
          <button
            key={index}
            className="flex w-full cursor-pointer space-x-3 overflow-hidden bg-neutral-900 p-3 transition-colors duration-150 ease-in-out hover:bg-neutral-600"
            onClick={() => {
              handleOpenRecentFile(filepath);
              setOpenDropdown(null);
            }}
          >
            <span className="shrink-0 font-medium">{filename}</span>
            <span className="min-w-max text-neutral-400">{filepath}</span>
          </button>
        ))}
      </>
    );
  };

  return (
    <>
      <span className="px-4 font-normal">File</span>

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

      <Button onClick={handleOpenFileTrigger} disabled={false}>
        Open
      </Button>

      <div className="relative">
        <Button onClick={() => toggleDropdown("recent")} disabled={false}>
          Recent +
        </Button>
        {openDropdown === "recent" && (
          <DropDownMenu ref={recentDropdownRef}>
            {recentFiles.length === 0 ? <RecentFilesListEmpty /> : <RecentFilesList />}
          </DropDownMenu>
        )}
      </div>

      <Button onClick={handleSaveAsTrigger} disabled={false}>
        Save As
      </Button>

      <Button onClick={handleSaveTrigger} disabled={false}>
        Save
      </Button>

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
