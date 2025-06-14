import { type FrontmatterPreviewProps } from "@renderer/types";

export default function FrontmatterPreview({
  frontmatter,
  serializeFrontmatter,
}: FrontmatterPreviewProps): React.ReactElement {
  let previewContent = "";
  if (frontmatter.format) {
    const { type, delimiter } = frontmatter.format;
    const serialized = serializeFrontmatter(type, frontmatter.content);
    previewContent = `${delimiter}\n${serialized.trim()}\n${delimiter}\n`;
  }

  return (
    <textarea
      className="scrollbar-style w-full grow cursor-copy resize-none border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
      value={previewContent}
      disabled
    />
  );
}
