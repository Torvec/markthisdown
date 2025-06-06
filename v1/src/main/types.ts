export type RecentFile = { filename: string; filepath: string };

export type ParsedFileType = {
  filepath: string;
  filename: string;
  format: FmFormatType;
  delimiter: FmDelimiterType;
  frontmatter: string;
  body: string;
};

export type FmFormatType = "yaml" | "toml" | null;

export type FmDelimiterType = "---" | "+++" | null;

export type FmFormatResult = {
  format: FmFormatType;
  delimiter: FmDelimiterType;
} | null;
