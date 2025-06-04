import FileMenuBar from "./file-menu-bar";
import FrontmatterMenuBar from "./frontmatter-menu-bar";
import BodyMenuBar from "./body-menu-bar";

type MainMenuProps = {
  isNewFile: boolean;
  setIsNewFile: (filestate: boolean) => void;
  fmIsEnabled: boolean;
  setFmIsEnabled: (fmState: boolean) => void;
  fmFormat: "yaml" | "toml" | null;
  setFmFormat: (format: "yaml" | "toml" | null) => void;
  fileInfo: { filename: string; filepath: string; buttonIsEnabled: boolean };
  setFileInfo: (info: { filename: string; filepath: string; buttonIsEnabled: boolean }) => void;
  setFmViewMode: (view: "block" | "lineitems") => void;
  fmIsVisible: boolean;
  setFmIsVisible: (visible: boolean) => void;
  fmContent: string;
  setFmContent: (content: string) => void;
  bodyContent: string;
  setBodyContent: (content: string) => void;
};

type FileData = {
  filepath: string;
  filename: string;
  format: "yaml" | "toml" | null;
  frontmatter: string;
  body: string;
};

export default function MainMenu({
  isNewFile,
  setIsNewFile,
  fmIsEnabled,
  setFmIsEnabled,
  fmFormat,
  setFmFormat,
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
  //* FILE HANDLERS
  const handleNewFileWithFm = (format: "yaml" | "toml"): void => {
    setFileInfo({
      filename: "untitled.md",
      filepath: "untitled.md",
      buttonIsEnabled: false,
    });
    setFmIsEnabled(true);
    setFmFormat(format);
    setFmContent(format === "yaml" ? "key: value" : "key = value");
    setBodyContent("Body Content");
  };

  const handleNewFileNoFm = (): void => {
    setFileInfo({
      filename: "untitled.md",
      filepath: "untitled.md",
      buttonIsEnabled: false,
    });
    setFmIsEnabled(false);
    setFmFormat(null);
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
        buttonIsEnabled: true,
      });
      if (
        file.frontmatter === null ||
        file.frontmatter === undefined ||
        file.frontmatter.length === 0
      ) {
        setFmIsEnabled(false);
      } else {
        setFmIsEnabled(true);
        setFmFormat(file.format);
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
        buttonIsEnabled: true,
      });
    }
  };

  const combineEditorContent = (): string => {
    const delimiter = fmFormat === "yaml" ? "---" : "+++";
    const trimFmContent = fmIsEnabled ? `${delimiter}\n${fmContent.trim()}\n${delimiter}\n\n` : "";
    const trimBodyContent = bodyContent.trim();
    return `${trimFmContent}${trimBodyContent}\n`;
  };

  //* FRONTMATTER HANDLERS
  // const handleFmFormats = (): void => {
  //   console.log("doesn't do anything...yet");
  // };

  const handleFmViewMode = (view: "block" | "lineitems"): void => {
    setFmViewMode(view);
    if (!fmIsVisible) setFmIsVisible(true);
  };

  const handleFmVisibility = (): void => setFmIsVisible(!fmIsVisible);

  const handleFmClearConfirm = (): void => setFmContent("");

  const handleFmDisableConfirm = (): void => {
    setFmIsEnabled(false);
    if (!fmIsVisible) setFmIsVisible(true);
    setFmContent("");
  };

  const handleFmEnable = (): void => {
    setFmIsEnabled(true);
    if (!fmFormat) setFmFormat("yaml");
    setFmContent(fmFormat === "yaml" ? "key: value" : "key = value");
  };

  //* BODY HANDLERS
  const handleClearBodyConfirm = (): void => {
    setBodyContent("");
  };

  return (
    <nav className="flex flex-wrap items-center gap-1">
      <FileMenuBar
        handleNewFileWithFm={handleNewFileWithFm}
        handleNewFileNoFm={handleNewFileNoFm}
        handleOpenFileTrigger={handleOpenFileTrigger}
        handleOpenRecentFile={handleOpenRecentFile}
        handleSaveAsTrigger={handleSaveAsTrigger}
        handleSaveTrigger={handleSaveTrigger}
      />
      <FrontmatterMenuBar
        fmIsEnabled={fmIsEnabled}
        fmIsVisible={fmIsVisible}
        // handleFmFormats={handleFmFormats}
        handleFmViewMode={handleFmViewMode}
        handleFmVisibility={handleFmVisibility}
        handleFmClearConfirm={handleFmClearConfirm}
        handleFmDisableConfirm={handleFmDisableConfirm}
        handleFmEnable={handleFmEnable}
      />
      <BodyMenuBar handleClearBodyConfirm={handleClearBodyConfirm} />
    </nav>
  );
}
