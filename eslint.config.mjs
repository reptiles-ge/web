import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import perfectionist from "eslint-plugin-perfectionist";
import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cssConfigPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "src/app/globals.css",
);

const perfectionistNatural = perfectionist.configs["recommended-natural"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...perfectionistNatural,
    rules: {
      ...perfectionistNatural.rules,
      "perfectionist/sort-objects": [
        "error",
        {
          order: "asc",
          partitionByComment: true,
          partitionByNewLine: true,
          type: "natural",
        },
      ],
    },
  },
  {
    ...tailwindcss.configs.recommended,
    rules: {
      ...tailwindcss.configs.recommended.rules,
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-arbitrary-value": "off",
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
            "text-display-card",
            "text-display-hero",
            "text-display-kicker",
            "text-display-lead",
            "text-display-stat",
            "text-display-title",
            "font-display",
          ],
        },
      ],
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
    },
    settings: {
      ...tailwindcss.configs.recommended.settings,
      tailwindcss: {
        ...tailwindcss.configs.recommended.settings?.tailwindcss,
        cssConfigPath,
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
  },
  {
    files: ["src/lib/cn.ts"],
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  },
  {
    plugins: {
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
  {
    files: [
      "src/components/species-atlas/**/*.{ts,tsx}",
      "src/components/map/GeorgiaMap.tsx",
      "src/components/map/RegionDetailsPanel.tsx",
      "src/components/map/SpeciesCard.tsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              allowTypeImports: true,
              message:
                "Client atlas/map code must not import the full species catalog. Use SpeciesListItem props, atlasFilters, mapRegions, or speciesAtlasMeta.",
              name: "@/data/species",
            },
            {
              allowTypeImports: true,
              message:
                "Client atlas/map code must not import the generated catalog.",
              name: "@/data/species.generated",
            },
            {
              allowTypeImports: true,
              message:
                "Client atlas/map code must not import locale overlays.",
              name: "@/data/species-en",
            },
            {
              allowTypeImports: true,
              message:
                "Client atlas/map code must not import locale overlays.",
              name: "@/data/species-ru",
            },
            {
              allowTypeImports: true,
              message:
                "Client atlas/map code must not import locale overlays.",
              name: "@/data/species-tr",
            },
            {
              allowTypeImports: true,
              message:
                "localizeSpecies pulls the full catalog. Pass localized SpeciesListItem props from a Server Component.",
              name: "@/i18n/localizeSpecies",
            },
            {
              allowTypeImports: true,
              message:
                "@/data/regions imports the full catalog. Use mapRegions and pass species as props.",
              name: "@/data/regions",
            },
            {
              allowTypeImports: true,
              message:
                "@/data/speciesAtlas imports the full catalog. Use atlasFilters or speciesAtlasMeta.",
              name: "@/data/speciesAtlas",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    ".pnpm-store/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/data/species.generated.ts",
    "src/data/georgia-paths.generated.ts",
    "src/data/optimizedImages.generated.ts",
    "scripts/**",
  ]),
]);

export default eslintConfig;
