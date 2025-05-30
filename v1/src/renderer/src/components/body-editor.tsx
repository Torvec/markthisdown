import React from "react";

type BodyEditorProps = {
  bodyContent: string;
  setBodyContent: (value: string) => void;
};

const BodyEditor: React.FC<BodyEditorProps> = ({ bodyContent, setBodyContent }) => {
  return (
    <section>
      <textarea
        name="bodyContent"
        id="bodyContent"
        className="block min-h-96 w-full resize-y border border-neutral-700 bg-neutral-800 p-4 outline-0 focus-visible:bg-neutral-700/50"
        value={bodyContent}
        onChange={(e) => setBodyContent(e.target.value)}
      />
    </section>
  );
};

export default BodyEditor;
