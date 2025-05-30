import { useState } from "react";
import MainMenu from "./components/main-menu";
import FileInfo from "./components/file-info";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";

function App(): React.JSX.Element {
  const [isNewFile, setIsNewFile] = useState(true);
  const [fileInfo, setFileInfo] = useState({
    filename: "untitled.md",
    filepath: "untitled.md",
    showFileInFolderDisabled: true,
  });
  const [fmContent, setFmContent] = useState("---\nkey: value\n---");
  const [bodyContent, setBodyContent] = useState("Body Content");

  return (
    <>
      <header className="mx-auto flex border-b border-neutral-700 text-sm font-medium">
        <MainMenu
          isNewFile={isNewFile}
          setIsNewFile={setIsNewFile}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
          fmContent={fmContent}
          setFmContent={setFmContent}
          bodyContent={bodyContent}
          setBodyContent={setBodyContent}
        />
      </header>
      <main className="mx-auto space-y-2 bg-neutral-900 p-2">
        <FileInfo fileInfo={fileInfo} />
        <FrontmatterEditor fmContent={fmContent} setFmContent={setFmContent} />
        <BodyEditor bodyContent={bodyContent} setBodyContent={setBodyContent} />
      </main>
    </>
  );
}

export default App;
