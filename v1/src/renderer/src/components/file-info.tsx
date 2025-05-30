import React from "react";
import Button from "./button";

interface FileInfoProps {
  fileInfo: {
    filename: string;
    filepath: string;
    showFileInFolderDisabled: boolean;
  };
}

function FileInfo({ fileInfo }: FileInfoProps): React.ReactElement {
  const handleShowFileInFolder = (): void => {
    console.log("Show file in folder handled");
    // use shell.showItemInFolder(fullPath) in main and create a preload script using contextBridge
    // Also, needs to be disabled if the file hasn't been saved yet (i.e. it's a new file)
  };

  return (
    <section className="flex items-baseline gap-4">
      <h2 id="filename" className="border border-neutral-700 bg-neutral-950 px-4 py-2 font-medium">
        {fileInfo.filename}
      </h2>
      <span id="filepath" className="block px-2 py-1 italic text-neutral-500">
        {fileInfo.filepath}
      </span>
      <Button onClick={handleShowFileInFolder} disabled={fileInfo.showFileInFolderDisabled}>
        Show File in Folder
      </Button>
    </section>
  );
}

export default FileInfo;
