import React from "react";

interface FileInfoProps {
  fileInfo: {
    filename: string;
    filepath: string;
  };
}

function FileInfo({ fileInfo }: FileInfoProps): React.ReactElement {
  return (
    <section className="flex items-baseline gap-4">
      <h2 id="filename" className="border border-neutral-700 bg-neutral-950 px-4 py-2 font-medium">
        {fileInfo.filename}
      </h2>
      <span id="filepath" className="block px-2 py-1 italic text-neutral-500">
        {fileInfo.filepath}
      </span>
    </section>
  );
}

export default FileInfo;
