import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      ".turbo/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },
]);

export default eslintConfig;
