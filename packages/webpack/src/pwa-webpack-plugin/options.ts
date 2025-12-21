export interface IPWAWebpackPluginOptions {
  name: string;
  short_name?: string;
  id?: string;
  description?: string;
  icon?: string;
  start_url?: string;
  display?: "standalone" | "browser" | "fullscreen" | "minimal-ui";
  theme_color?: string;
  background_color?: string;
}
