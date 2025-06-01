import React from "react";

type FrontmatterEditorProps = {
  fmIsEnabled: boolean;
  fmIsVisible: boolean;
  fmViewMode: "block" | "lineitems";
  fmContent: string | null;
  setFmContent: (value: string) => void;
};

function FrontmatterEditor({
  fmIsEnabled,
  fmViewMode,
  fmIsVisible,
  fmContent,
  setFmContent,
}: FrontmatterEditorProps): React.ReactElement {
  return (
    <>
      {fmIsEnabled && fmIsVisible && (
        <div>
          {fmViewMode === "block" ? (
            <textarea
              className="min-h-48 w-full resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={fmContent ?? ""}
              onChange={(e) => setFmContent(e.target.value)}
            />
          ) : (
            <div className="grid-cols-2 gap-3">
              <div className="flex gap-3">
                <input type="text" className="w-1/2 border border-neutral-700 bg-neutral-800" />
                <input type="text" className="w-1/2 border border-neutral-700 bg-neutral-800" />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default FrontmatterEditor;
