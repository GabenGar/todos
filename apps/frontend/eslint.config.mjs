import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import turboConfig from 'eslint-config-turbo/flat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  turboConfig,
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      // for some reason linting, the one during `next build` command,
      // ignores settings in turbo package configuration
      // even it works just fine in IDE and `lint` command
      "turbo/no-undeclared-env-vars": "warn"
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      ".turbo/**",
      "out/**",
      "next-env.d.ts",
    ],
  },
]);

export default eslintConfig;
