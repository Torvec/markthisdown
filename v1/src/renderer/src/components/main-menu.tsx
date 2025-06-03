import FileMenuBar from "./file-menu-bar";
import FrontmatterMenuBar from "./frontmatter-menu-bar";

interface MainMenuProps {
  isNewFile: boolean;
  setIsNewFile: (filestate: boolean) => void;
  fmIsEnabled: boolean;
  setFmIsEnabled: (fmState: boolean) => void;
  fileInfo: { filename: string; filepath: string; showFileInFolderDisabled: boolean };
  setFileInfo: (info: {
    filename: string;
    filepath: string;
    showFileInFolderDisabled: boolean;
  }) => void;
  setFmViewMode: (view: "block" | "lineitems") => void;
  fmIsVisible: boolean;
  setFmIsVisible: (visible: boolean) => void;
  fmContent: string;
  setFmContent: (content: string) => void;
  bodyContent: string;
  setBodyContent: (content: string) => void;
}

interface FileData {
  filepath: string;
  filename: string;
  frontmatter: string;
  body: string;
}

export default function MainMenu({
  isNewFile,
  setIsNewFile,
  fmIsEnabled,
  setFmIsEnabled,
  fileInfo,
  setFileInfo,
  setFmViewMode,
  fmIsVisible,
  setFmIsVisible,
  fmContent,
  setFmContent,
  bodyContent,
  setBodyContent,
}: MainMenuProps): React.ReactElement {
  const handleNewFileWithFm = (): void => {
    setFileInfo({
      filename: "untitled.md",
      filepath: "untitled.md",
      showFileInFolderDisabled: true,
    });
    setFmIsEnabled(true);
    setFmContent("---\nkey: value\n---");
    setBodyContent("Body Content");
  };

  const handleNewFileNoFm = (): void => {
    setFileInfo({
      filename: "untitled.md",
      filepath: "untitled.md",
      showFileInFolderDisabled: true,
    });
    setFmIsEnabled(false);
    setFmContent("");
    setBodyContent("Body Content");
  };

  const handleOpenFileTrigger = async (): Promise<void> => {
    const openFileDialog = await window.electron.ipcRenderer.invoke("open-file-dialog");
    handleOpenFile(openFileDialog);
  };

  const handleOpenRecentFile = async (filepath: string): Promise<void> => {
    const openRecentFile = await window.electron.ipcRenderer.invoke("open-recent-file", filepath);
    handleOpenFile(openRecentFile);
  };

  const handleOpenFile = (file: FileData | undefined): void => {
    if (file !== undefined) {
      setIsNewFile(false);
      setFileInfo({
        filename: file.filename,
        filepath: file.filepath,
        showFileInFolderDisabled: false,
      });
      if (
        file.frontmatter === null ||
        file.frontmatter === undefined ||
        file.frontmatter.length === 0
      ) {
        setFmIsEnabled(false);
      } else {
        setFmIsEnabled(true);
        setFmContent(file.frontmatter);
      }
      setBodyContent(file.body);
    }
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
    const savedFile = isNewFile
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

  const handleSaveFile = (file: FileData | undefined): void => {
    if (file !== undefined) {
      setIsNewFile(false);
      setFileInfo({
        filename: file.filename,
        filepath: file.filepath,
        showFileInFolderDisabled: false,
      });
      setFmContent(file.frontmatter);
      setBodyContent(file.body);
    }
  };

  const combineEditorContent = (): string => {
    const trimFmContent = fmIsEnabled ? fmContent.trim() + "\n\n" : "";
    const trimBodyContent = bodyContent.trim();
    return trimFmContent + trimBodyContent;
  };

  const handleClearAllConfirm = (): void => {
    if (fmIsEnabled) setFmContent("---\n\n---");
    setBodyContent("");
  };

  // FRONTMATTER HANDLERS

  const handleFmViewMode = (view: "block" | "lineitems"): void => {
    setFmViewMode(view);
    if (!fmIsVisible) setFmIsVisible(true);
  };

  const handleFmVisibility = (): void => setFmIsVisible(!fmIsVisible);

  const handleFmClearConfirm = (): void => setFmContent("---\n\n---");

  const handleFmDisableConfirm = (): void => {
    setFmIsEnabled(false);
    if (!fmIsVisible) setFmIsVisible(true);
    setFmContent("");
  };

  const handleFmEnable = (): void => {
    setFmIsEnabled(true);
    setFmContent("---\nkey: value\n---");
  };

  return (
    <nav className="flex flex-wrap items-center gap-0.5">
      <FileMenuBar
        handleNewFileWithFm={handleNewFileWithFm}
        handleNewFileNoFm={handleNewFileNoFm}
        handleOpenFileTrigger={handleOpenFileTrigger}
        handleOpenRecentFile={handleOpenRecentFile}
        handleSaveAsTrigger={handleSaveAsTrigger}
        handleSaveTrigger={handleSaveTrigger}
        handleClearAllConfirm={handleClearAllConfirm}
      />
      <FrontmatterMenuBar
        fmIsEnabled={fmIsEnabled}
        fmIsVisible={fmIsVisible}
        handleFmViewMode={handleFmViewMode}
        handleFmVisibility={handleFmVisibility}
        handleFmClearConfirm={handleFmClearConfirm}
        handleFmDisableConfirm={handleFmDisableConfirm}
        handleFmEnable={handleFmEnable}
      />
    </nav>
  );
}
