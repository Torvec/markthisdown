import { type FrontmatterEditorProps } from "@renderer/types";

export default function FrontmatterEditor({
  frontmatter,
}: FrontmatterEditorProps): React.ReactElement {
  if (!frontmatter.isVisible) return <div></div>;

  if (!frontmatter.isEnabled) {
    return (
      <div className="border-neutral-600 bg-neutral-950 p-4 text-neutral-500">
        Frontmatter Editor is Disabled, Press Enable to add frontmatter to document.
      </div>
    );
  }

  const delimiter = frontmatter.format?.type === "yaml" ? ":" : "=";
  const editContent = frontmatter.content.split("\n").map((line) => line.split(delimiter));

  return (
    <div>
      {frontmatter.viewMode === "edit" ? (
        <div className="grid-cols-2 gap-3 border border-neutral-700">
          {editContent.map((item, index) => (
            <div key={index} className="flex gap-2 p-2">
              <input
                type="text"
                className="w-1/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
                value={item[0]}
              />
              <input
                type="text"
                className="w-2/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
                value={item[1]}
              />
            </div>
          ))}
        </div>
      ) : (
        <textarea
          className="min-h-48 w-full cursor-not-allowed resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
          value={frontmatter.content}
          disabled
        />
      )}
    </div>
  );
}
