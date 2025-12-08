import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // Matikan semua peringatan <img>
      "@next/next/no-img-element": "off",

      // Matikan larangan <link rel="stylesheet">
      "@next/next/no-css-tags": "off",

      // Matikan larangan <script> synchronous
      "@next/next/no-sync-scripts": "off",
      
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
