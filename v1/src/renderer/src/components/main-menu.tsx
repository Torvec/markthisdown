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
  fmViewMode: "block" | "lineitems";
  setFmViewMode: (view: "block" | "lineitems") => void;
  fmIsVisible: boolean;
  setFmIsVisible: (visible: boolean) => void;
  fmContent: string | null;
  setFmContent: (content: string | null) => void;
  bodyContent: string;
  setBodyContent: (content: string) => void;
}

export default function MainMenu({
  isNewFile,
  setIsNewFile,
  fmIsEnabled,
  setFmIsEnabled,
  fileInfo,
  setFileInfo,
  fmViewMode,
  setFmViewMode,
  fmIsVisible,
  setFmIsVisible,
  fmContent,
  setFmContent,
  bodyContent,
  setBodyContent,
}: MainMenuProps): React.ReactElement {
  const handleNewFileWithFm = (): void => {
    setFmIsEnabled(true);
    setFileInfo({
      filename: "untitled.md",
      filepath: "untitled.md",
      showFileInFolderDisabled: true,
    });
    setFmContent("---\nkey: value\n---");
    setBodyContent("Body Content");
  };

  const handleNewFileNoFm = (): void => {
    setFmIsEnabled(false);
    setFileInfo({
      filename: "untitled.md",
      filepath: "untitled.md",
      showFileInFolderDisabled: true,
    });
    setFmContent(null);
    setBodyContent("Body Content");
  };

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

  //! OPEN RECENT FILE
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOpenRecentTrigger = () => console.log("Handled Open Recent Trigger");

  const handleSaveAsTrigger = async (): Promise<void> => {
    const saveFileDialog = await window.electron.ipcRenderer.invoke(
      "save-file-dialog",
      fileInfo.filepath,
      combineEditorContent(),
    );
    if (saveFileDialog !== undefined) handleFileState(saveFileDialog);
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
    if (savedFile !== undefined) handleFileState(savedFile);
  };

  interface FileData {
    filepath: string;
    filename: string;
    frontmatter: string | null;
    body: string;
  }

  // This only applies to save as and save
  const handleFileState = (file: FileData | undefined): void => {
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
    const trimFmContent = fmIsEnabled && fmContent ? fmContent.trim() + "\n\n" : "";
    const trimBodyContent = bodyContent.trim();
    return trimFmContent + trimBodyContent;
  };

  const handleClearAllConfirm = (): void => {
    if (fmIsEnabled) setFmContent("---\n\n---");
    setBodyContent("");
  };

  // FRONTMATTER HANDLERS

  const handleFmBlockView = (): void => {
    setFmViewMode("block");
    if (!fmIsVisible) setFmIsVisible(true);
  };

  const handleFmLineItemsView = (): void => {
    setFmViewMode("lineitems");
    if (!fmIsVisible) setFmIsVisible(true);
  };

  const handleFmHide = (): void => setFmIsVisible(false);

  const handleFmShow = (): void => setFmIsVisible(true);

  const handleFmConfirmClear = (): void => setFmContent("---\n\n---");

  const handleFmConfirmRemove = (): void => {
    setFmIsEnabled(false);
    setFmContent(null);
  };
  const handleFmAdd = (): void => {
    setFmIsEnabled(true);
    setFmContent("---\n\n---");
  };

  return (
    <nav className="flex flex-wrap items-center gap-0.5">
      <FileMenuBar
        handleNewFileWithFm={handleNewFileWithFm}
        handleNewFileNoFm={handleNewFileNoFm}
        handleOpenFileTrigger={handleOpenFileTrigger}
        handleOpenRecentTrigger={handleOpenRecentTrigger}
        handleSaveAsTrigger={handleSaveAsTrigger}
        handleSaveTrigger={handleSaveTrigger}
        handleClearAllConfirm={handleClearAllConfirm}
      />
      <FrontmatterMenuBar
        fmIsEnabled={fmIsEnabled}
        fmViewMode={fmViewMode}
        fmIsVisible={fmIsVisible}
        handleFmBlockView={handleFmBlockView}
        handleFmLineItemsView={handleFmLineItemsView}
        handleFmHide={handleFmHide}
        handleFmShow={handleFmShow}
        handleFmConfirmClear={handleFmConfirmClear}
        handleFmConfirmRemove={handleFmConfirmRemove}
        handleFmAdd={handleFmAdd}
      />
    </nav>
  );
}
