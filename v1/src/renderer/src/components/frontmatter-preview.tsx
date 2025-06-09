import { type FrontmatterPreviewProps } from "@renderer/types";

export default function FrontmatterPreview({
  frontmatter,
  serializeFrontmatter,
}: FrontmatterPreviewProps): React.ReactElement {
  let previewContent = "";
  if (frontmatter.format) {
    const { type, delimiter } = frontmatter.format;
    const serialized = serializeFrontmatter(type, frontmatter.content);
    previewContent = `${delimiter}\n${serialized}\n${delimiter}\n`;
  }

  return (
    <textarea
      className="min-h-64 w-full cursor-not-allowed resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
      value={previewContent}
      disabled
    />
  );
}
