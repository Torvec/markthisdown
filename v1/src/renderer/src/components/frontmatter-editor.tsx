type FrontmatterEditorProps = {
  fmIsEnabled: boolean;
  fmIsVisible: boolean;
  fmViewMode: "block" | "lineitems";
  fmContent: string;
  setFmContent: (value: string) => void;
};

export default function FrontmatterEditor({
  fmIsEnabled,
  fmViewMode,
  fmIsVisible,
  fmContent,
  setFmContent,
}: FrontmatterEditorProps): React.ReactElement {
  if (!fmIsVisible) return <div></div>;

  if (!fmIsEnabled) {
    return (
      <div className="border-neutral-600 bg-neutral-950 p-4 text-neutral-500">
        Frontmatter Editor is Disabled, Press Enable to add frontmatter to document.
      </div>
    );
  }

  const lineItemContent = fmContent.split("\n").map((line) => line.split(":"));

  return (
    <div>
      {fmViewMode === "block" ? (
        <textarea
          className="min-h-48 w-full resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
          value={fmContent}
          onChange={(e) => setFmContent(e.target.value)}
        />
      ) : (
        <div className="grid-cols-2 gap-3">
          {lineItemContent.map((item, index) => (
            <div key={index} className="flex gap-3 p-2">
              <input
                type="text"
                className="w-1/2 border border-neutral-700 bg-neutral-800 px-2 py-1"
                value={item[0]}
                onChange={() => setFmContent}
              />
              <input
                type="text"
                className="w-1/2 border border-neutral-700 bg-neutral-800 px-2 py-1"
                value={item[1]}
                onChange={() => setFmContent}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
