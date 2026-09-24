export interface IBlogPostItem {
  id: string;
  title: string;
}

export interface IBlogPostPreview extends IBlogPostItem {
  description: string;
  created_at?: string;
  published_at: string;
  edited_at: string;
  version: number;
}

export interface IBlogPostOverview extends IBlogPostPreview {
  content: string;
}

export interface IBlogPostMeta
  extends Pick<
    IBlogPostPreview,
    | "title"
    | "description"
    | "created_at"
    | "edited_at"
    | "published_at"
    | "version"
  > {}
