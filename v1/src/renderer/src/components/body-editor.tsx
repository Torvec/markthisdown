import React from "react";

type BodyEditorProps = {
  bodyContent: string;
};

const BodyEditor: React.FC<BodyEditorProps> = ({ bodyContent }) => {
  return (
    <section>
      <textarea
        name="bodyContent"
        id="bodyContent"
        className="block min-h-96 w-full resize-y border border-neutral-500 bg-neutral-800 p-4 outline-0 focus-visible:bg-neutral-700/75"
        defaultValue={bodyContent}
      ></textarea>
    </section>
  );
};

export default BodyEditor;
