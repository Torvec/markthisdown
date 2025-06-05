type FrontmatterEditorProps = {
  fmIsEnabled: boolean;
  fmIsVisible: boolean;
  fmFormat: "yaml" | "toml" | null;
  fmViewMode: "edit" | "preview";
  fmContent: string;
  setFmContent: (value: string) => void;
};

export default function FrontmatterEditor({
  fmIsEnabled,
  fmViewMode,
  fmIsVisible,
  fmFormat,
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

  const delimiter = fmFormat === "yaml" ? ":" : "=";
  const editContent = fmContent.split("\n").map((line) => line.split(delimiter));

  return (
    <div>
      {fmViewMode === "edit" ? (
        <div className="grid-cols-2 gap-3 border border-neutral-700">
          {editContent.map((item, index) => (
            <div key={index} className="flex gap-2 p-2">
              <input
                type="text"
                className="w-1/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
                value={item[0]}
                onChange={(e) => setFmContent(e.target.value)}
              />
              <input
                type="text"
                className="w-2/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
                value={item[1]}
                onChange={(e) => setFmContent(e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : (
        <textarea
          className="min-h-48 w-full cursor-not-allowed resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
          value={fmContent}
          disabled
        />
      )}
    </div>
  );
}
