import { type FrontmatterEditProps } from "@renderer/types";
import IconButton from "./icon-button";
import { Plus, Minus, ChevronUp, ChevronDown } from "lucide-react";

export default function FrontmatterEdit({
  frontmatter,
  setFrontmatter,
}: FrontmatterEditProps): React.ReactElement {
  const handleContentChange = (rowIdx: number, colIdx: number, newVal: string): void => {
    setFrontmatter((prev) => {
      const content = [...(prev.content as [string, unknown][])];
      const row = [...content[rowIdx]] as [string, unknown];
      row[colIdx] = newVal;
      content[rowIdx] = row;
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

  const handleMoveItem = (idxToMove: number, dir: "up" | "dn"): void => {
    setFrontmatter((prev) => {
      const content = [...(prev.content as [string, unknown][])];
      const idxToSwap = dir === "up" ? idxToMove - 1 : idxToMove + 1;
      if (idxToSwap < 0 || idxToSwap >= content.length) return prev;
      [content[idxToMove], content[idxToSwap]] = [content[idxToSwap], content[idxToMove]];
      return { ...prev, content };
    });
  };

  return (
    <div className="scrollbar-style min-h-0 grow grid-cols-2 gap-3 border-y border-l border-neutral-700">
      {Array.isArray(frontmatter.content) &&
        frontmatter.content.map(([key, value], index) => (
          <div key={index} className="flex gap-2 p-2">
            <div className="flex">
              <IconButton onClick={() => handleAddItem(index)} label="Add">
                <Plus size={16} />
              </IconButton>
              <IconButton onClick={() => handleRemoveItem(index)} label="Remove">
                <Minus size={16} />
              </IconButton>
              <IconButton
                onClick={() => handleMoveItem(index, "up")}
                disabled={index === 0}
                label="Move Up"
              >
                <ChevronUp size={16} />
              </IconButton>
              <IconButton
                onClick={() => handleMoveItem(index, "dn")}
                disabled={index === frontmatter.content.length - 1}
                label="Move Down"
              >
                <ChevronDown size={16} />
              </IconButton>
            </div>
            <input
              type="text"
              className="w-1/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={key}
              onChange={(e) => handleContentChange(index, 0, e.target.value)}
            />
            <input
              type="text"
              className="w-2/3 border border-neutral-800 bg-neutral-900 px-2 py-1 outline-0 focus-visible:border-neutral-600 focus-visible:bg-neutral-700/50"
              value={String(value)}
              onChange={(e) => handleContentChange(index, 1, e.target.value)}
            />
          </div>
        ))}
    </div>
  );
}
