import Markdown from "react-markdown";

export default function BodyPreview({ bodyContent }: { bodyContent: string }): React.ReactElement {
  return (
    <div className="min-h-[30vh] bg-neutral-900 p-4">
      <Markdown>{bodyContent}</Markdown>
    </div>
  );
}
