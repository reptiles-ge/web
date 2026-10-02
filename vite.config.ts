import { cloudflare } from "@cloudflare/vite-plugin";
import { responseStoreAdapter } from "@vinext/cloudflare/cache/response-store-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import vinext from "vinext";
import { defineConfig } from "vite";

const responseStore = responseStoreAdapter();
Object.assign(responseStore.cdn.capabilities, {
  routeCacheability: "probe-manifest" as const,
});

export default defineConfig({
  build: {
    rolldownOptions: {
      external: ["sharp"],
    },
  },
  plugins: [
    vinext({
      cache: responseStore,
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
