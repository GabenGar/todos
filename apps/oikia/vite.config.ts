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
      sourcemap: true,
      rollupOptions: {
        /**
         * Shut down messages in build log
         * https://github.com/vitejs/vite/issues/15012#issuecomment-1815854072
         */
        onLog(level, log, handler) {
          if (
            log.cause &&
            // @ts-expect-error generic lib types
            log.cause.message === `Can't resolve original location of error.`
          ) {
            return;
          }

          handler(level, log);
        },
        input: isSsrBuild ? "./server/app.ts" : undefined,
      },
    },
  };

  return finalConfig;
});

export default config;
