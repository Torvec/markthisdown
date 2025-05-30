import React from "react";

type FrontmatterEditorProps = {
  fmContent: string;
  setFmContent: (value: string) => void;
}

function FrontmatterEditor({
  fmContent,
  setFmContent,
}: FrontmatterEditorProps): React.ReactElement {
  return (
    <div id="fmEditor">
      <textarea
        id="fmContentBlock"
        className="min-h-48 w-full resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
        value={fmContent}
        onChange={(e) => setFmContent(e.target.value)}
      />
      <div id="fmContentLineItems" className="hidden grid-cols-2 gap-3">
        <div className="flex gap-3">
          <input type="text" className="w-1/2" />
          <input type="text" className="w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default FrontmatterEditor;
