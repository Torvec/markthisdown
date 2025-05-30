import { useState } from "react";
import MainMenu from "./components/main-menu";
import FileInfo from "./components/file-info";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";

function App(): React.JSX.Element {
  const [fileInfo, setFileInfo] = useState({ filename: "untitled.md", filepath: "untitled.md" });
  const [fmContent, setFmContent] = useState("---\nkey: value\n---");
  const [bodyContent, setBodyContent] = useState("Body Content");

  const handleFileInfo = (file) => {
    setFileInfo({ filename: file.filename, filepath: file.filepath });
  };

  return (
    <>
      <header className="mx-auto flex border-b border-neutral-700 pl-2 text-sm font-medium">
        <MainMenu />
      </header>
      <main className="mx-auto space-y-2 bg-neutral-900 p-2">
        <FileInfo fileInfo={fileInfo} />
        <FrontmatterEditor fmContent={fmContent} />
        <BodyEditor bodyContent={bodyContent} />
      </main>
    </>
  );
}

export default App;
