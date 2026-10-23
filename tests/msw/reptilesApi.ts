import { http } from "msw";

import type { ApiBindings } from "@/api/env";

export const REPTILES_API_TEST_TOKEN = "test-admin-token";

let env: ApiBindings | undefined;

export function resetReptilesApi() {
  env = undefined;
}

export const reptilesApi = http.all(
  "https://api.reptiles.ge/*",
  async ({ request }) => {
    const [{ app }, { createNewsTestDatabase }] = await Promise.all([
      import("@/api/app"),
      import("@/api/testing/sqliteDatabase"),
    ]);
    env ??= {
      API_WRITE_TOKEN: REPTILES_API_TEST_TOKEN,
      DB: createNewsTestDatabase().db,
      REVALIDATE_TOKEN: "test-revalidate-token",
      SITE: { fetch: async () => new Response(null, { status: 204 }) },
    };
    return app.request(request, undefined, env);
  },
);
