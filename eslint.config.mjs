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

  // Load plugins (required for rules like ban-types)
  ...compat.plugins("@typescript-eslint"),

  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-types": [
        "error",
        {
          types: {
            "{}": false, // allow empty object types
          },
          extendDefaults: true,
        },
      ],
    },
  },
];

export default eslintConfig;