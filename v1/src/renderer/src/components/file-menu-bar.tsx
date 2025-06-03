import { useState, useRef, useEffect } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";

interface FileMenuBarProps {
  handleNewFileWithFm: () => void;
  handleNewFileNoFm: () => void;
  handleOpenFileTrigger: () => void;
  handleOpenRecentFile: (filepath: string) => void;
  handleSaveAsTrigger: () => void;
  handleSaveTrigger: () => void;
}

type RecentFile = { filename: string; filepath: string };

export default function FileMenuBar({
  handleNewFileWithFm,
  handleNewFileNoFm,
  handleOpenFileTrigger,
  handleOpenRecentFile,
  handleSaveAsTrigger,
  handleSaveTrigger,
}: FileMenuBarProps): React.ReactElement {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const newDropdownRef = useRef<HTMLDivElement>(null!);
  const recentDropdownRef = useRef<HTMLDivElement>(null!);

  const dropdownRefs = {
    new: newDropdownRef,
    recent: recentDropdownRef,
  };

  useDropdownClose({ openDropdown, dropdownRefs, setOpenDropdown });

  const toggleDropdown = (id: string): void => setOpenDropdown(openDropdown === id ? null : id);

  useEffect(() => {
    if (openDropdown === "recent") {
      (async () => {
        const files = await window.electron.ipcRenderer.invoke("get-recent-files");
        setRecentFiles(files);
      })();
    }
  }, [openDropdown]);

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
    <div>
      <div className="w-max bg-neutral-900 px-4 py-1 font-normal text-neutral-400">File</div>
      <div className="flex gap-0.5">
        <div className="relative">
          <Button onClick={() => toggleDropdown("new")} disabled={false}>
            New +
          </Button>
          {openDropdown === "new" && (
            <DropDownMenu ref={newDropdownRef}>
              <DropDownButton
                onClick={() => {
                  handleNewFileWithFm();
                  setOpenDropdown(null);
                }}
              >
                With Fronmatter
              </DropDownButton>
              <DropDownButton
                onClick={() => {
                  handleNewFileNoFm();
                  setOpenDropdown(null);
                }}
              >
                No Frontmatter
              </DropDownButton>
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
      </div>
    </div>
  );
}
