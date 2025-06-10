import Markdown from "react-markdown";

export default function BodyPreview({ bodyContent }: { bodyContent: string }): React.ReactElement {
  return (
    <div className="prose dark:prose-invert max-h-screen max-w-none overflow-auto p-2">
      <Markdown>{bodyContent}</Markdown>
    </div>
  );
}
