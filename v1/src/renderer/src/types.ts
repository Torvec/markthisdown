export type DefaultsType = {
  file: string;
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
  format: FrontmatterFormatType | null;
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

export type FrontmatterFormatType = "yaml" | "toml";

export type FrontmatterFormat = {
  type: FrontmatterFormatType;
  delimiter: "---" | "+++";
};

export type FrontmatterState = {
  isEnabled: boolean;
  isVisible: boolean;
  format: FrontmatterFormat | null;
  view: "edit" | "preview" | null;
  content: [string, unknown][] | "";
};

export type FrontmatterMenuBarProps = {
  defaults: DefaultsType;
  frontmatter: FrontmatterState;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
};

export type FrontmatterEditorProps = {
  frontmatter: FrontmatterState;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
  serializeFrontmatter: (
    type: FrontmatterFormatType,
    content: FrontmatterState["content"],
  ) => string;
};

export type FileMenuBarProps = {
  defaults: DefaultsType;
  fileInfo: FileInfoType;
  setFileInfo: React.Dispatch<React.SetStateAction<FileInfoType>>;
  setFrontmatter: React.Dispatch<React.SetStateAction<FrontmatterState>>;
  setBodyContent: React.Dispatch<React.SetStateAction<string>>;
  parseFrontmatter: (format: FrontmatterFormatType, frontmatter: string) => [string, unknown][];
  combineEditorContent: () => string;
};

export type BodyMenuBarProps = {
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
  children: React.ReactNode;
};

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};
