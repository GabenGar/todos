export interface IBlogPostItem {
  id: string;
  title: string;
}

export interface IBlogPostPreview extends IBlogPostItem {
  description: string;
  created_at: string;
  published_at?: string
  edited_at?: string;
}
