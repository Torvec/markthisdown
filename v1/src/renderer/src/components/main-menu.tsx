import FileMenuBar from "./file-menu-bar";
import FrontmatterMenuBar from "./frontmatter-menu-bar";

interface MainMenuProps {
  isNewFile: boolean;
  setIsNewFile: (filestate: boolean) => void;
  FmIsEnabled: boolean;
  setFmIsEnabled: (fmState: boolean) => void;
  fileInfo: { filename: string; filepath: string; showFileInFolderDisabled: boolean };
  setFileInfo: (info: {
    filename: string;
    filepath: string;
    showFileInFolderDisabled: boolean;
  }) => void;
  fmContent: string;
  setFmContent: (content: string | null) => void;
  bodyContent: string;
  setBodyContent: (content: string) => void;
}

export default function MainMenu({
  isNewFile,
  setIsNewFile,
  // FmIsEnabled,
  setFmIsEnabled,
  fileInfo,
  setFileInfo,
  fmContent,
  setFmContent,
  bodyContent,
  setBodyContent,
}: MainMenuProps): React.ReactElement {
  // NEW FILE WITH FM
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

  // NEW FILE NO FM
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

  // OPEN FILE
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

  // OPEN RECENT FILE
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleOpenRecentTrigger = () => console.log("Handled Open Recent Trigger");

  // SAVE AS
  const handleSaveAsTrigger = async (): Promise<void> => {
    const saveFileDialog = await window.electron.ipcRenderer.invoke(
      "save-file-dialog",
      fileInfo.filepath,
      combineEditorContent(),
    );
    if (saveFileDialog !== undefined) {
      setIsNewFile(false);
      setFileInfo({
        filename: saveFileDialog.filename,
        filepath: saveFileDialog.filepath,
        showFileInFolderDisabled: false,
      });
      setFmContent(saveFileDialog.frontmatter);
      setBodyContent(saveFileDialog.body);
    }
  };

  // SAVE
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
    setIsNewFile(false);
    setFileInfo({
      filename: savedFile.filename,
      filepath: savedFile.filepath,
      showFileInFolderDisabled: false,
    });
    setFmContent(savedFile.frontmatter);
    setBodyContent(savedFile.body);
  };

  // CLEAR ALL CONFIRM
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClearAllConfirm = () => console.log("Clear All Confirmed");
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
  const handleFmConfirmRemove = () => console.log("Remove Confirm clicked");
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFmAdd = () => console.log("Add clicked");

  const combineEditorContent = (): string => {
    const trimFmContent = fmContent.trim() + "\n\n";
    const trimBodyContent = bodyContent.trim();
    return trimFmContent + trimBodyContent;
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
