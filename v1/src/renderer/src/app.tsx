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
  type FrontmatterFormat,
  type FrontmatterState,
  type FileInfoType,
  type DefaultsType,
} from "./types";

export default function App(): React.ReactElement {
  //* DEFAULTS
  const defaults: DefaultsType = {
    file: "untitled.md",
    fm: {
      format: { type: "yaml", delimiter: "---" },
      view: "edit",
      content: [["key", "value"]],
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

  //* FILE HANDLER UTILITY FUNCTIONS

  const parseFrontmatter = (
    format: FrontmatterFormat["type"],
    frontmatter: string,
  ): [string, unknown][] => {
    const parsed = format === "yaml" ? YAML.parse(frontmatter) : TOML.parse(frontmatter);
    return Object.entries(parsed);
  };

  const serializeFrontmatter = (
    format: FrontmatterFormat["type"],
    fmArr: [string, unknown][] | "",
  ): string => {
    if (fmArr === "") return "";
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex grow">
        <FileMenuBar
          defaults={defaults}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          setFrontmatter={setFrontmatter}
          setBodyContent={setBodyContent}
          parseFrontmatter={parseFrontmatter}
          combineEditorContent={combineEditorContent}
        />
        <main className="flex grow flex-col">
          <FileInfo fileInfo={fileInfo} />
          <div className="p-2">
            <FrontmatterMenuBar
              defaults={defaults}
              frontmatter={frontmatter}
              setFrontmatter={setFrontmatter}
            />
            <FrontmatterEditor
              frontmatter={frontmatter}
              setFrontmatter={setFrontmatter}
              serializeFrontmatter={serializeFrontmatter}
            />
          </div>
          <div className="flex grow flex-col p-2">
            <BodyMenuBar setBodyContent={setBodyContent} />
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
