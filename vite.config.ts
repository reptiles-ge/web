import { cloudflare } from "@cloudflare/vite-plugin";
import { responseStoreAdapter } from "@vinext/cloudflare/cache/response-store-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rolldownOptions: {
      external: ["sharp"],
    },
  },
  plugins: [
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
