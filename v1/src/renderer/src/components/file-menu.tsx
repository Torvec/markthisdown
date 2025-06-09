import { useState, useRef, useEffect } from "react";
import useDropdownClose from "@renderer/hooks/use-dropdown-close";
import DropDownMenu from "./drop-down-menu";
import Button from "./button";
import DropDownButton from "./drop-down-button";
import {
  type FileMenuProps,
  type RecentFile,
  type FrontmatterFormat,
  type FileData,
} from "@renderer/types";

export default function FileMenu({
  defaults,
  fileInfo,
  setFileInfo,
  setFrontmatter,
  setBodyContent,
  parseFrontmatter,
  combineEditorContent,
}: FileMenuProps): React.ReactElement {
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

  //* FILE HANDLERS
  const handleNewFileWithFm = ({ type, delimiter }: FrontmatterFormat): void => {
    setFileInfo({
      isNew: true,
      filename: defaults.file,
      filepath: defaults.file,
      buttonIsEnabled: false,
    });
    setFrontmatter({
      isEnabled: true,
      isVisible: true,
      format: { type: type, delimiter: delimiter },
      view: defaults.fm.view,
      content: defaults.fm.content,
    });
    setBodyContent(defaults.body.content);
  };

  const handleNewFileNoFm = (): void => {
    setFileInfo({
      isNew: true,
      filename: defaults.file,
      filepath: defaults.file,
      buttonIsEnabled: false,
    });
    setFrontmatter({
      isEnabled: false,
      isVisible: true,
      format: null,
      view: null,
      content: "",
    });
    setBodyContent(defaults.body.content);
  };

  const handleOpenFileTrigger = async (): Promise<void> => {
    const openFileDialog = await window.electron.ipcRenderer.invoke("open-file-dialog");
    handleOpenFile(openFileDialog);
  };

  const handleOpenRecentFile = async (filepath): Promise<void> => {
    const openRecentFile = await window.electron.ipcRenderer.invoke("open-recent-file", filepath);
    handleOpenFile(openRecentFile);
  };

  const handleSaveAsTrigger = async (): Promise<void> => {
    const saveFileDialog = await window.electron.ipcRenderer.invoke(
      "save-file-dialog",
      fileInfo.filepath,
      combineEditorContent(),
    );
    handleSaveFile(saveFileDialog);
  };

  const handleSaveTrigger = async (): Promise<void> => {
    const savedFile = fileInfo.isNew
      ? await window.electron.ipcRenderer.invoke(
          "save-file-dialog",
          fileInfo.filepath,
          combineEditorContent(),
        )
      : await window.electron.ipcRenderer.invoke(
          "save-file",
          fileInfo.filepath,
          combineEditorContent(),
        );
    handleSaveFile(savedFile);
  };

  const handleOpenFile = (file: FileData | undefined): void => {
    if (file !== undefined) {
      setFileInfo({
        isNew: false,
        filename: file.filename,
        filepath: file.filepath,
        buttonIsEnabled: true,
      });
      if (
        !file.frontmatter ||
        file.frontmatter.length === 0 ||
        file.format === null ||
        file.delimiter === null
      ) {
        setFrontmatter({
          isEnabled: false,
          isVisible: true,
          format: null,
          view: null,
          content: "",
        });
      } else {
        setFrontmatter({
          isEnabled: true,
          isVisible: true,
          format: {
            type: file.format,
            delimiter: file.delimiter,
          },
          view: defaults.fm.view,
          content: parseFrontmatter(file.format, file.frontmatter),
        });
      }
      setBodyContent(file.body);
    }
  };

  const handleSaveFile = (file: FileData | undefined): void => {
    if (file !== undefined) {
      setFileInfo({
        isNew: false,
        filename: file.filename,
        filepath: file.filepath,
        buttonIsEnabled: true,
      });
    }
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
