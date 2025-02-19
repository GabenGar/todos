import type { Config } from "@react-router/dev/config";

const config = {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  appDirectory: "src",
} satisfies Config;

export default config;
