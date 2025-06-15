import { useState } from "react";
import YAML from "yaml";
import TOML from "smol-toml";
import FileMenu from "./components/file-menu";
import FileInfo from "./components/file-info";
import FrontmatterMenu from "./components/frontmatter-menu";
import Frontmatter from "./components/frontmatter";
import BodyMenu from "./components/body-menu";
import BodyEditor from "./components/body-editor";
import BodyPreview from "./components/body-preview";
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
    return `${delimiter}\n${serializedFmContent.trim()}\n${delimiter}\n\n${bodyContent.trim()}`;
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-800 text-neutral-100">
      <div className="flex min-h-0 grow">
        <FileMenu
          defaults={defaults}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          setFrontmatter={setFrontmatter}
          setBodyContent={setBodyContent}
          parseFrontmatter={parseFrontmatter}
          combineEditorContent={combineEditorContent}
        />
        <div className="flex min-h-0 grow flex-col">
          <FileInfo fileInfo={fileInfo} />
          <div className="flex min-h-0 grow">
            {/* Col 1 */}
            <div className="flex min-h-0 w-1/2 flex-col gap-4 p-2">
              {/* Row 1 */}
              <div className="flex h-1/3 flex-col">
                <FrontmatterMenu
                  defaults={defaults}
                  frontmatter={frontmatter}
                  setFrontmatter={setFrontmatter}
                />
                <Frontmatter
                  frontmatter={frontmatter}
                  setFrontmatter={setFrontmatter}
                  serializeFrontmatter={serializeFrontmatter}
                />
              </div>
              {/* Row 2 */}
              <div className="flex min-h-0 grow flex-col">
                <BodyMenu setBodyContent={setBodyContent} />
                <BodyEditor bodyContent={bodyContent} setBodyContent={setBodyContent} />
              </div>
            </div>
            {/* Col 2 */}
            <BodyPreview bodyContent={bodyContent} />
          </div>
        </div>
      </div>
      <div className="bg-blue-500/50 text-center text-neutral-200">
        <p>Status Bar *Under Development*</p>
      </div>
    </div>
  );
}
