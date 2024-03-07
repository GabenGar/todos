export interface IRequiredProperties extends Record<string, unknown> {
  id: number;
  created_at: string;
  title?: string;
}
