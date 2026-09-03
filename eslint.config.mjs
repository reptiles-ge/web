import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import perfectionist from "eslint-plugin-perfectionist";
import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...tailwindcss.configs.recommended,
    settings: {
      ...tailwindcss.configs.recommended.settings,
      tailwindcss: {
        ...tailwindcss.configs.recommended.settings?.tailwindcss,
        cssConfigPath: "./src/app/globals.css",
        functions: [
          "cn",
          "clsx",
          "classnames",
          "classNames",
          "ctl",
          "cva",
          "tv",
          "tw",
          "twMerge",
          "twJoin",
        ],
      },
    },
    rules: {
      ...tailwindcss.configs.recommended.rules,
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          whitelist: [
            "hero-drift",
            "media-placeholder",
            "no-scrollbar",
            "glass-card",
            "species-carousel-track",
            "map-explorer",
            "map-explorer-texture",
            "text-balance-tight",
            "font-display",
          ],
        },
      ],
    },
  },
  {
    files: ["src/lib/cn.ts"],
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    plugins: {
      perfectionist,
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  eslintConfigPrettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/data/species.generated.ts",
    "scripts/**",
  ]),
]);

export default eslintConfig;
