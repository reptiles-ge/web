import type { Plugin } from "vite";

import { cloudflare } from "@cloudflare/vite-plugin";
import { responseStoreAdapter } from "@vinext/cloudflare/cache/response-store-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import vinext from "vinext";
import { defineConfig } from "vite";

const EMPTY_SEARCH_INDEX = "\0reptiles:empty-search-index";
const SEARCH_INDEX_MODULE =
  /search-index\.(?:en|ka|ru|tr)\.generated(?:\.ts)?$/;

function clientOnlySearchIndex(): Plugin {
  return {
    applyToEnvironment: (environment) =>
      environment.config.consumer === "server",
    enforce: "pre",
    load(id) {
      return id === EMPTY_SEARCH_INDEX
        ? "export const searchDocuments = [];"
        : null;
    },
    name: "reptiles:client-only-search-index",
    resolveId(source) {
      return SEARCH_INDEX_MODULE.test(source) ? EMPTY_SEARCH_INDEX : null;
    },
  };
}

export default defineConfig({
  build: {
    rolldownOptions: {
      external: ["sharp"],
    },
  },
  plugins: [
    clientOnlySearchIndex(),
    vinext({
      cache: responseStoreAdapter(),
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      configPath: "wrangler.vinext.jsonc",
      viteEnvironment: {
        childEnvironments: ["ssr"],
        name: "rsc",
      },
    }),
  ],
});
