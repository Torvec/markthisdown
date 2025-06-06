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
  format: FrontmatterFormatType | null;
  delimiter: "---" | "+++" | null;
  frontmatter: string;
  body: string;
};

type FrontmatterFormatType = "yaml" | "toml";

type FrontmatterFormat = {
  type: FrontmatterFormatType;
  delimiter: "---" | "+++";
};

type FrontmatterState = {
  isEnabled: boolean;
  isVisible: boolean;
  format: FrontmatterFormat | null;
  viewMode: "edit" | "preview" | null;
  content: string;
};

type FileInfo = {
  isNew: boolean;
  filename: string;
  filepath: string;
  buttonIsEnabled: boolean;
};

export default function App(): React.ReactElement {
  const [fileInfo, setFileInfo] = useState<FileInfo>({
    isNew: true,
    filename: "untitled.md",
    filepath: "untitled.md",
    buttonIsEnabled: false,
  });
  const [frontmatter, setFrontmatter] = useState<FrontmatterState>({
    isEnabled: true,
    isVisible: true,
    format: {
      type: "yaml",
      delimiter: "---",
    },
    viewMode: "edit",
    content: "key: value",
  });
  const [bodyContent, setBodyContent] = useState<string>("Body Content");

  //* FILE HANDLERS
  const handleNewFileWithFm = ({ type, delimiter }: FrontmatterFormat): void => {
    setFileInfo({
      isNew: true,
      filename: "untitled.md",
      filepath: "untitled.md",
      buttonIsEnabled: false,
    });
    setFrontmatter({
      isEnabled: true,
      isVisible: true,
      format: {
        type: type,
        delimiter: delimiter,
      },
      viewMode: "edit",
      content: type === "yaml" ? "key: value" : "kay = value",
    });
    setBodyContent("Body Content");
  };

  const handleNewFileNoFm = (): void => {
    setFileInfo({
      isNew: true,
      filename: "untitled.md",
      filepath: "untitled.md",
      buttonIsEnabled: false,
    });
    setFrontmatter({
      isEnabled: false,
      isVisible: false,
      format: null,
      viewMode: null,
      content: "",
    });
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
          viewMode: null,
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
          viewMode: "edit",
          content: file.frontmatter,
        });
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

  const combineEditorContent = (): string => {
    const delimiter = frontmatter.format?.type === "yaml" ? "---" : "+++";
    const trimFmContent = frontmatter.isEnabled
      ? `${delimiter}\n${frontmatter.content.trim()}\n${delimiter}\n\n`
      : "";
    const trimBodyContent = bodyContent.trim();
    return `${trimFmContent}${trimBodyContent}\n`;
  };

  //* FRONTMATTER HANDLERS
  const handleFmFormats = (): void => {
    console.log("doesn't do anything...yet");
  };

  const handleFmViewMode = (view: "edit" | "preview"): void => {
    setFrontmatter((prev) => ({
      ...prev,
      viewMode: view,
    }));
    if (!frontmatter.isVisible)
      setFrontmatter((prev) => ({
        ...prev,
        isVisible: true,
      }));
  };

  const handleFmVisibility = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  };

  const handleFmClearConfirm = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      content: "",
    }));
  };

  const handleFmDisableConfirm = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      isEnabled: false,
      isVisible: true,
      content: "",
    }));
  };

  const handleFmEnable = (): void => {
    setFrontmatter((prev) => ({
      ...prev,
      isEnabled: true,
      format: prev.format ? prev.format : { type: "yaml", delimiter: "---" },
      content: prev.format && prev.format.type === "yaml" ? "key: value" : "key = value",
    }));
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
              frontmatter={frontmatter}
              handleFmFormats={handleFmFormats}
              handleFmViewMode={handleFmViewMode}
              handleFmVisibility={handleFmVisibility}
              handleFmClearConfirm={handleFmClearConfirm}
              handleFmDisableConfirm={handleFmDisableConfirm}
              handleFmEnable={handleFmEnable}
            />
            <FrontmatterEditor frontmatter={frontmatter} />
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
