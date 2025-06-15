import Markdown from "react-markdown";

export default function BodyPreview({ bodyContent }: { bodyContent: string }): React.ReactElement {
  return (
    <div className="flex w-1/2 flex-col p-2">
      <div>
        <h2 className="w-max bg-neutral-900 p-2 text-neutral-400">Body Preview</h2>
      </div>
      <div className="prose dark:prose-invert scrollbar-style min-h-0 max-w-none grow border-y border-l border-neutral-700 p-4">
        <Markdown>{bodyContent}</Markdown>
      </div>
    </div>
  );
}
