import { useState, useRef, useEffect } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";

type FileMenuBarProps = {
  handleNewFileWithFm: ({
    type,
    delimiter,
  }: {
    type: "yaml" | "toml";
    delimiter: "---" | "+++";
  }) => void;
  handleNewFileNoFm: () => void;
  handleOpenFileTrigger: () => void;
  handleOpenRecentFile: (filepath: string) => void;
  handleSaveAsTrigger: () => void;
  handleSaveTrigger: () => void;
};

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

  const RecentFilesList = ({ recentFiles }: { recentFiles: RecentFile[] }): React.ReactElement => {
    return (
      <>
        {recentFiles.length > 0 ? (
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
        ) : (
          <p className="text-center italic text-neutral-500">Recent Files List Empty</p>
        )}
      </>
    );
  };

  return (
    <div className="flex w-max flex-col gap-0.5 bg-neutral-900 p-2">
      <div className="relative">
        <Button onClick={() => toggleDropdown("new")}>Ne</Button>
        {openDropdown === "new" && (
          <DropDownMenu ref={newDropdownRef}>
            <DropDownButton
              onClick={() => {
                handleNewFileWithFm({ type: "yaml", delimiter: "---" });
                setOpenDropdown(null);
              }}
            >
              YAML Fronmatter
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                handleNewFileWithFm({ type: "toml", delimiter: "+++" });
                setOpenDropdown(null);
              }}
            >
              TOML Fronmatter
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
      <Button onClick={handleOpenFileTrigger}>Op</Button>
      <div className="relative">
        <Button onClick={() => toggleDropdown("recent")}>Re</Button>
        {openDropdown === "recent" && (
          <DropDownMenu ref={recentDropdownRef}>
            <RecentFilesList recentFiles={recentFiles} />
          </DropDownMenu>
        )}
      </div>
      <Button onClick={handleSaveAsTrigger}>Sa</Button>
      <Button onClick={handleSaveTrigger}>Sv</Button>
    </div>
  );
}
