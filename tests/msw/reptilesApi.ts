import { http } from "msw";

import type { ApiBindings } from "@/api/env";

import { app } from "@/api/app";
import { createSpeciesTestDatabase } from "@/api/testing/sqliteDatabase";

export const REPTILES_API_TEST_TOKEN = "test-admin-token";

let env: ApiBindings | undefined;

export function resetReptilesApi() {
  env = undefined;
}

export const reptilesApi = http.all(
  "https://api.reptiles.ge/*",
  async ({ request }) => {
    env ??= {
      API_WRITE_TOKEN: REPTILES_API_TEST_TOKEN,
      DB: createSpeciesTestDatabase().db,
      REVALIDATE_TOKEN: "test-revalidate-token",
      SITE: { fetch: async () => new Response(null, { status: 204 }) },
    };
    return app.request(request, undefined, env);
  },
);
