import { useState } from "react";
import MainMenu from "./components/main-menu";
import FileInfo from "./components/file-info";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";

function App(): React.JSX.Element {
  const [isNewFile, setIsNewFile] = useState(true);
  const [fmIsEnabled, setFmIsEnabled] = useState(true);
  const [fileInfo, setFileInfo] = useState({
    filename: "untitled.md",
    filepath: "untitled.md",
    showFileInFolderDisabled: true,
  });
  const [fmIsVisible, setFmIsVisible] = useState(true);
  const [fmViewMode, setFmViewMode] = useState<"block" | "lineitems">("block");
  const [fmDelimiters, setFmDelimiters] = useState<"yaml" | "toml" | "json">("yaml");
  const [fmContent, setFmContent] = useState<string | null>(
    fmDelimiters + "\nkey: value\n" + fmDelimiters,
  );
  const [bodyContent, setBodyContent] = useState("Body Content");

  return (
    <>
      <header className="mx-auto flex border-b border-neutral-700 text-sm font-medium">
        <MainMenu
          isNewFile={isNewFile}
          setIsNewFile={setIsNewFile}
          fmIsEnabled={fmIsEnabled}
          setFmIsEnabled={setFmIsEnabled}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          fmDelimiters={fmDelimiters}
          setFmDelimiters={setFmDelimiters}
          fmViewMode={fmViewMode}
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

export default App;
