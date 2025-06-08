import { useState } from "react";
import YAML from "yaml";
import TOML from "smol-toml";
import FileInfo from "./components/file-info";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";
import FileMenuBar from "./components/file-menu-bar";
import FrontmatterMenuBar from "./components/frontmatter-menu-bar";
import BodyMenuBar from "./components/body-menu-bar";
import {
  type FileData,
  type FrontmatterFormat,
  type FrontmatterState,
  type FileInfoType,
  type FrontmatterFormatType,
} from "./types";

export default function App(): React.ReactElement {
  //* DEFAULTS
  const defaults = {
    file: "untitled.md",
    fm: {
      format: { type: "yaml", delimiter: "---" } as FrontmatterFormat,
      view: "edit" as FrontmatterState["view"],
      content: [["key", "value"]] as [string, unknown][],
    },
    body: {
      content: "Body Content",
    },
  };

  //* STATE VARIABLES
  const [fileInfo, setFileInfo] = useState<FileInfoType>({
    isNew: true,
    filename: defaults.file,
    filepath: defaults.file,
    buttonIsEnabled: false,
  });
  const [frontmatter, setFrontmatter] = useState<FrontmatterState>({
    isEnabled: true,
    isVisible: true,
    format: defaults.fm.format,
    view: defaults.fm.view,
    content: defaults.fm.content,
  });
  const [bodyContent, setBodyContent] = useState<string>(defaults.body.content);

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

  //* FILE HANDLER UTILITY FUNCTIONS
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

  const parseFrontmatter = (
    format: FrontmatterFormatType,
    frontmatter: string,
  ): [string, unknown][] => {
    const parsed = format === "yaml" ? YAML.parse(frontmatter) : TOML.parse(frontmatter);
    return Object.entries(parsed);
  };

  const serializeFrontmatter = (
    format: FrontmatterFormatType,
    fmArr: [string, unknown][],
  ): string => {
    const fmObj = Object.fromEntries(fmArr);
    const serialized = format === "yaml" ? YAML.stringify(fmObj) : TOML.stringify(fmObj);
    return serialized;
  };

  const combineEditorContent = (): string => {
    if (!frontmatter.format) return bodyContent.trim();
    const { type, delimiter } = frontmatter.format;
    const fmContentArr = frontmatter.content as [string, unknown][];
    const serializedFmContent = serializeFrontmatter(type, fmContentArr);
    return delimiter + "\n" + serializedFmContent + "\n" + delimiter + "\n\n" + bodyContent.trim();
  };

  //* FRONTMATTER HANDLERS
  const handleFmFormats = (format: FrontmatterFormatType): void => {
    setFrontmatter((prev) => ({
      ...prev,
      format: { type: format, delimiter: format === "yaml" ? "---" : "+++" },
    }));
  };

  const handleFmViewMode = (view: FrontmatterState["view"]): void => {
    setFrontmatter((prev) => ({
      ...prev,
      view: view,
      isVisible: prev.isVisible ? prev.isVisible : true,
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
      content: [["", ""]],
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
      format: prev.format ? prev.format : defaults.fm.format,
      view: defaults.fm.view,
      content: defaults.fm.content,
    }));
  };

  const handleFmContentChange = (index: number, position: 0 | 1, value: unknown): void => {
    const newContent = [...frontmatter.content];
    const item = [...newContent[index]];
    item[position] = value;
    newContent[index] = item;
    setFrontmatter({ ...frontmatter, content: newContent });
  };

  const handleAddItem = (idxBeforeAdd: number): void => {
    const itemToAdd: [string, unknown] = ["key", "value"];
    setFrontmatter((prev) => ({
      ...prev,
      content: [
        ...prev.content.slice(0, idxBeforeAdd + 1),
        itemToAdd,
        ...prev.content.slice(idxBeforeAdd + 1),
      ],
    }));
  };

  const handleRemoveItem = (idxToRemove: number): void => {
    setFrontmatter((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== idxToRemove),
    }));
  };

  //! DOES NOT WORK YET
  const handleMoveItem = (currentIdx: number, dir: "up" | "down"): void => {
    const targetIdx = dir === "up" ? currentIdx - 1 : currentIdx + 1;
    setFrontmatter((prev) => {
      [[...prev.content][currentIdx], [...prev.content][targetIdx]] = [
        [...prev.content][targetIdx],
        [...prev.content][currentIdx],
      ];
    });
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
        <main className="flex grow flex-col">
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
            <FrontmatterEditor
              frontmatter={frontmatter}
              handleFmContentChange={handleFmContentChange}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
              handleMoveItem={handleMoveItem}
              serializeFrontmatter={serializeFrontmatter}
            />
          </div>
          <div className="flex grow flex-col p-2">
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
