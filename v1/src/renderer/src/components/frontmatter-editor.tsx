import { type FrontmatterEditorProps } from "@renderer/types";
import Button from "./button";

export default function FrontmatterEditor({
  frontmatter,
  serializeFrontmatter,
}: FrontmatterEditorProps): React.ReactElement {
  if (!frontmatter.isVisible) return <div></div>;

  if (!frontmatter.isEnabled) {
    return (
      <div className="border-neutral-600 bg-neutral-950 p-4 text-neutral-500">
        Frontmatter Editor is Disabled, Press Enable to add frontmatter to document.
      </div>
    );
  }

  const EditViewContent = (): React.ReactElement => {
    return (
      <div className="grid-cols-2 gap-3 border border-neutral-700">
        {frontmatter.content.map((item, index) => (
          <div key={index} className="flex gap-2 p-2">
            <div className="flex gap-0.5">
              <Button onClick={() => console.log("Add")}>+</Button>
              <Button onClick={() => console.log("Remove")}>-</Button>
              <Button onClick={() => console.log("Move Up")}>up</Button>
              <Button onClick={() => console.log("Move Down")}>dn</Button>
            </div>
            <input
              type="text"
              className="w-1/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={item[0]}
              onChange={() => console.log("key")}
            />
            <input
              type="text"
              className="w-2/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={item[1]}
              onChange={() => console.log("value")}
            />
          </div>
        ))}
      </div>
    );
  };

  const PreviewContent = (): React.ReactElement => {
    const { type, delimiter } = frontmatter.format;
    const serialized = serializeFrontmatter(type, frontmatter.content);
    const previewContent = `${delimiter}\n${serialized}\n${delimiter}\n`;

    return (
      <textarea
        className="min-h-48 w-full cursor-not-allowed resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
        value={previewContent}
        disabled
      />
    );
  };

  return (
    <div>
      {frontmatter.view === "edit" && <EditViewContent />}
      {frontmatter.view === "preview" && <PreviewContent />}
    </div>
  );
}
