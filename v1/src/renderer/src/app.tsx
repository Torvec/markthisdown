import { useState } from "react";
import MainMenu from "./components/main-menu";
import FileInfo from "./components/file-info";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";

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
  const [fmViewMode, setFmViewMode] = useState<"block" | "lineitems">("block");
  const [fmContent, setFmContent] = useState<string>("key: value");
  const [bodyContent, setBodyContent] = useState("Body Content");

  return (
    <>
      <header className="mx-auto flex border-b border-neutral-700 text-sm font-medium">
        <MainMenu
          isNewFile={isNewFile}
          setIsNewFile={setIsNewFile}
          fmIsEnabled={fmIsEnabled}
          setFmIsEnabled={setFmIsEnabled}
          fmFormat={fmFormat}
          setFmFormat={setFmFormat}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          setFmViewMode={setFmViewMode}
          fmIsVisible={fmIsVisible}
          setFmIsVisible={setFmIsVisible}
          fmContent={fmContent}
          setFmContent={setFmContent}
          bodyContent={bodyContent}
          setBodyContent={setBodyContent}
        />
      </header>
      <main className="mx-auto space-y-2 bg-neutral-900 p-2">
        <FileInfo fileInfo={fileInfo} />
        <FrontmatterEditor
          fmIsEnabled={fmIsEnabled}
          fmFormat={fmFormat}
          fmViewMode={fmViewMode}
          fmIsVisible={fmIsVisible}
          fmContent={fmContent}
          setFmContent={setFmContent}
        />
        <BodyEditor bodyContent={bodyContent} setBodyContent={setBodyContent} />
      </main>
    </>
  );
}
