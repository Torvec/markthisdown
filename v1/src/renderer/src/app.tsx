import MainMenu from "./components/main-menu";
import FileInfo from "./components/file-info";
import FrontmatterMenu from "./components/frontmatter-menu";
import FrontmatterEditor from "./components/frontmatter-editor";
import BodyEditor from "./components/body-editor";

function App(): React.JSX.Element {
  return (
    <>
      <header className="container mx-auto flex max-w-4xl border-b border-neutral-700 pl-2 text-sm font-medium">
        <MainMenu />
      </header>
      <main className="container mx-auto max-w-4xl space-y-2 border-x border-b border-neutral-700 bg-neutral-900 p-2">
        <FileInfo />
        <FrontmatterMenu />
        <FrontmatterEditor />
        <BodyEditor />
      </main>
    </>
  );
}

export default App;
