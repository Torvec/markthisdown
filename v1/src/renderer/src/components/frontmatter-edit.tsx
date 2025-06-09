import { type FrontmatterEditProps } from "@renderer/types";
import Button from "./button";

export default function FrontmatterEdit({
  frontmatter,
  setFrontmatter,
}: FrontmatterEditProps): React.ReactElement {
  const handleFmContentChange = (rowIndex: number, colIndex: number, value: string): void => {
    setFrontmatter((prev) => {
      const content = [...(prev.content as [string, unknown][])];
      const row = [...content[rowIndex]] as [string, unknown];
      row[colIndex] = value;
      content[rowIndex] = row;
      return { ...prev, content };
    });
  };

  const handleAddItem = (idxBeforeAdd: number): void => {
    const itemToAdd: [string, unknown] = ["key", "value"];
    setFrontmatter((prev) => {
      const content = [...(prev.content as [string, unknown][])];
      const start = content.slice(0, idxBeforeAdd + 1);
      const end = content.slice(idxBeforeAdd + 1);
      const newContent = start.concat([itemToAdd], end);
      return { ...prev, content: newContent };
    });
  };

  const handleRemoveItem = (idxToRemove: number): void => {
    setFrontmatter((prev) => {
      const content = [...(prev.content as [string, unknown][])];
      const newContent = content.filter((_, i) => i !== idxToRemove);
      return { ...prev, content: newContent };
    });
  };

  const handleMoveItem = (): void => {
    console.log("moved");
  };

  return (
    <div className="grid-cols-2 gap-3 border border-neutral-700">
      {Array.isArray(frontmatter.content) &&
        frontmatter.content.map(([key, value], index) => (
          <div key={index} className="flex gap-2 p-2">
            <div className="flex gap-0.5">
              <Button onClick={() => handleAddItem(index)}>+</Button>
              <Button onClick={() => handleRemoveItem(index)}>-</Button>
              <Button onClick={() => handleMoveItem()} disabled={index === 0}>
                up
              </Button>
              <Button
                onClick={() => handleMoveItem()}
                disabled={index === frontmatter.content.length - 1}
              >
                dn
              </Button>
            </div>
            <input
              type="text"
              className="w-1/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={key}
              onChange={(e) => handleFmContentChange(index, 0, e.target.value)}
            />
            <input
              type="text"
              className="w-2/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={String(value)}
              onChange={(e) => handleFmContentChange(index, 1, e.target.value)}
            />
          </div>
        ))}
    </div>
  );
}
