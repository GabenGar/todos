import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type UserConfig } from "vite";

const config = defineConfig(({ isSsrBuild }) => {
  const finalConfig: UserConfig = {
    plugins: [reactRouter()],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
    build: {
      rollupOptions: isSsrBuild
        ? {
            input: "./server/app.ts",
          }
        : undefined,
    },
  };

  return finalConfig;
});

export default config;
