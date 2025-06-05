import { useState } from "react";
import FileInfo from "./components/file-info";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";
import FileMenuBar from "./components/file-menu-bar";
import FrontmatterMenuBar from "./components/frontmatter-menu-bar";
import BodyMenuBar from "./components/body-menu-bar";

type FileData = {
  filepath: string;
  filename: string;
  format: "yaml" | "toml" | null;
  frontmatter: string;
  body: string;
};

export default function App(): React.ReactElement {
  const [isNewFile, setIsNewFile] = useState(true);
  const [fmIsEnabled, setFmIsEnabled] = useState(true);
  const [fmFormat, setFmFormat] = useState<"yaml" | "toml" | null>("yaml");
  const [fileInfo, setFileInfo] = useState({
    filename: "untitled.md",
    filepath: "untitled.md",
    buttonIsEnabled: false,
  });
  const [fmIsVisible, setFmIsVisible] = useState(true);
  const [fmViewMode, setFmViewMode] = useState<"edit" | "preview">("edit");
  const [fmContent, setFmContent] = useState<string>("key: value");
  const [bodyContent, setBodyContent] = useState("Body Content");

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
  const handleFmFormats = (): void => {
    console.log("doesn't do anything...yet");
  };

  const handleFmViewMode = (view: "edit" | "preview"): void => {
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
    <div className="flex min-h-screen flex-col">
      <div className="flex grow">
        <FileMenuBar
          handleNewFileWithFm={handleNewFileWithFm}
          handleNewFileNoFm={handleNewFileNoFm}
          handleOpenFileTrigger={handleOpenFileTrigger}
          handleOpenRecentFile={handleOpenRecentFile}
          handleSaveAsTrigger={handleSaveAsTrigger}
          handleSaveTrigger={handleSaveTrigger}
        />
        <main className="grow">
          <FileInfo fileInfo={fileInfo} />
          <div className="p-2">
            <FrontmatterMenuBar
              fmIsEnabled={fmIsEnabled}
              fmIsVisible={fmIsVisible}
              handleFmFormats={handleFmFormats}
              handleFmViewMode={handleFmViewMode}
              handleFmVisibility={handleFmVisibility}
              handleFmClearConfirm={handleFmClearConfirm}
              handleFmDisableConfirm={handleFmDisableConfirm}
              handleFmEnable={handleFmEnable}
            />
            <FrontmatterEditor
              fmIsEnabled={fmIsEnabled}
              fmFormat={fmFormat}
              fmViewMode={fmViewMode}
              fmIsVisible={fmIsVisible}
              fmContent={fmContent}
              setFmContent={setFmContent}
            />
          </div>
          <div className="p-2">
            <BodyMenuBar handleClearBodyConfirm={handleClearBodyConfirm} />
            <BodyEditor bodyContent={bodyContent} setBodyContent={setBodyContent} />
          </div>
        </main>
      </div>
      <footer className="bg-blue-500/50 text-center text-neutral-200">
        <p>Status Bar</p>
      </footer>
    </div>
  );
}
