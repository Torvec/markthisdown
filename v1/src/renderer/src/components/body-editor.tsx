import { type BodyEditorProps } from "@renderer/types";

export default function BodyEditor({
  bodyContent,
  setBodyContent,
}: BodyEditorProps): React.ReactElement {
  return (
    <textarea
      name="bodyContent"
      id="bodyContent"
      className="block w-full grow resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:bg-neutral-700/50"
      value={bodyContent}
      onChange={(e) => setBodyContent(e.target.value)}
    />
  );
}
