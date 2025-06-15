export type DefaultsType = {
  file: "untitled.md";
  fm: {
    format: FrontmatterFormat;
    view: FrontmatterState["view"];
    content: [string, unknown][];
  };
  body: {
    content: string;
  };
};

export type FileData = {
  filepath: string;
  filename: string;
  format: FrontmatterFormat["type"] | null;
  delimiter: FrontmatterFormat["delimiter"] | null;
  frontmatter: string;
  body: string;
};

export type FileInfoType = {
  isNew: boolean;
  filename: string;
  filepath: string;
  buttonIsEnabled: boolean;
};

export type FileInfoProps = {
  fileInfo: {
    filename: string;
    filepath: string;
    buttonIsEnabled: boolean;
  };
};

export type RecentFile = { filename: string; filepath: string };

export type FrontmatterFormat = {
  type: "yaml" | "toml";
  delimiter: "---" | "+++";
};

export type FrontmatterState = {
  isEnabled: boolean;
  isVisible: boolean;
  format: FrontmatterFormat | null;
  view: "edit" | "preview" | null;
  content: [string, unknown][] | "";
};

export type FrontmatterMenuProps = {
  defaults: DefaultsType;
  frontmatter: FrontmatterState;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
};

export type FrontmatterProps = {
  frontmatter: FrontmatterState;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
  serializeFrontmatter: (
    type: FrontmatterFormat["type"],
    content: FrontmatterState["content"],
  ) => string;
};

export type FrontmatterEditProps = {
  frontmatter: FrontmatterState;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
};

export type FrontmatterPreviewProps = {
  frontmatter: FrontmatterState;
  serializeFrontmatter: (
    type: FrontmatterFormat["type"],
    content: FrontmatterState["content"],
  ) => string;
};

export type FileMenuProps = {
  defaults: DefaultsType;
  fileInfo: FileInfoType;
  setFileInfo: React.Dispatch<React.SetStateAction<FileInfoType>>;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
  setBodyContent: React.Dispatch<React.SetStateAction<string>>;
  parseFrontmatter: (format: FrontmatterFormat["type"], frontmatter: string) => [string, unknown][];
  combineEditorContent: () => string;
};

export type BodyMenuProps = {
  setBodyContent: React.Dispatch<React.SetStateAction<string>>;
};

export type BodyEditorProps = {
  bodyContent: string;
  setBodyContent: (value: string) => void;
};

export type UseDropdownCloseProps = {
  openDropdown: string | null;
  dropdownRefs: Record<string, React.RefObject<HTMLDivElement>>;
  setOpenDropdown: (id: string | null) => void;
};

export type DropDownMenuProps = {
  ref: React.RefObject<HTMLDivElement>;
  pos?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
};

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};
