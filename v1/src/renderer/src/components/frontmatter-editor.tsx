import FrontmatterEdit from "./frontmatter-edit";
import FrontmatterPreview from "./frontmatter-preview";
import { type FrontmatterEditorProps } from "@renderer/types";

export default function FrontmatterEditor({
  frontmatter,
  setFrontmatter,
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

  return (
    <div>
      {frontmatter.view === "edit" && (
        <FrontmatterEdit frontmatter={frontmatter} setFrontmatter={setFrontmatter} />
      )}
      {frontmatter.view === "preview" && (
        <FrontmatterPreview frontmatter={frontmatter} serializeFrontmatter={serializeFrontmatter} />
      )}
    </div>
  );
}
