export interface ITodoInit extends Pick<ITodo, "title" | "description"> {}

export interface ITodo {
  id: string;
  created_at: Date;
  title: string;
  description?: string;
}
