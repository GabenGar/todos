import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, type UserConfig } from "vite";
import { parseConfig } from "./scripts/lib/parse-configuration.mjs";

const config = defineConfig(async ({ mode, isSsrBuild }) => {
  const publicConfig = (await parseConfig()).public

  if (publicConfig.is_translation_debug_enabled) {
    process.env.VITE_IS_TRANSLATION_DEBUG_ENABLED = JSON.stringify(publicConfig.is_translation_debug_enabled)
  }


  const finalConfig: UserConfig = {
    plugins: [reactRouter()],
    css: {
      preprocessorOptions: {
        scss: {
          // api: "modern",
        },
      },
    },
    build: {
      // fixes style ordering for prod-only
      cssCodeSplit: false,
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
        input: isSsrBuild ? "./backend/app.ts" : undefined,
      },
    },
  };

  return finalConfig;
});

export default config;
