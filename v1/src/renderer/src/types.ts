export type FileData = {
  filepath: string;
  filename: string;
  format: FrontmatterFormatType | null;
  delimiter: FrontmatterFormat["delimiter"] | null;
  frontmatter: string;
  body: string;
};

export type FrontmatterFormatType = "yaml" | "toml";

export type FrontmatterFormat = {
  type: FrontmatterFormatType;
  delimiter: "---" | "+++";
};

export type FrontmatterState = {
  isEnabled: boolean;
  isVisible: boolean;
  format: FrontmatterFormat | null;
  viewMode: "edit" | "preview" | null;
  content: string;
};

export type FileInfoType = {
  isNew: boolean;
  filename: string;
  filepath: string;
  buttonIsEnabled: boolean;
};

export type UseDropdownCloseProps = {
  openDropdown: string | null;
  dropdownRefs: Record<string, React.RefObject<HTMLDivElement>>;
  setOpenDropdown: (id: string | null) => void;
};

export type FrontmatterMenuBarProps = {
  frontmatter: FrontmatterState;
  handleFmFormats: () => void;
  handleFmViewMode: (view: FrontmatterState["viewMode"]) => void;
  handleFmVisibility: () => void;
  handleFmClearConfirm: () => void;
  handleFmDisableConfirm: () => void;
  handleFmEnable: () => void;
};

export type FrontmatterEditorProps = {
  frontmatter: FrontmatterState;
};

export type FileMenuBarProps = {
  handleNewFileWithFm: ({
    type,
    delimiter,
  }: {
    type: FrontmatterFormatType;
    delimiter: FrontmatterFormat["delimiter"];
  }) => void;
  handleNewFileNoFm: () => void;
  handleOpenFileTrigger: () => void;
  handleOpenRecentFile: (filepath: string) => void;
  handleSaveAsTrigger: () => void;
  handleSaveTrigger: () => void;
};

export type RecentFile = { filename: string; filepath: string };

export type FileInfoProps = {
  fileInfo: {
    filename: string;
    filepath: string;
    buttonIsEnabled: boolean;
  };
};

export type DropDownMenuProps = {
  ref: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
};

export type DropDownButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
};

export type BodyMenuBarProps = {
  handleClearBodyConfirm: () => void;
};

export type BodyEditorProps = {
  bodyContent: string;
  setBodyContent: (value: string) => void;
};
