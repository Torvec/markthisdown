import Button from "./button";

interface FileInfoProps {
  fileInfo: {
    filename: string;
    filepath: string;
    buttonIsEnabled: boolean;
  };
}

export default function FileInfo({ fileInfo }: FileInfoProps): React.ReactElement {
  const handleShowFileInFolder = async (): Promise<void> => {
    await window.electron.ipcRenderer.invoke("show-file-in-folder", fileInfo.filepath);
  };

  return (
    <section className="flex items-baseline gap-4">
      <h2 id="filename" className="border border-neutral-700 bg-neutral-950 px-4 py-2 font-medium">
        {fileInfo.filename}
      </h2>
      <span id="filepath" className="block px-2 py-1 italic text-neutral-500">
        {fileInfo.filepath}
      </span>
      <Button onClick={handleShowFileInFolder} disabled={!fileInfo.buttonIsEnabled}>
        Show In Folder
      </Button>
    </section>
  );
}
