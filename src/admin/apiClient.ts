import { createApiClient } from "@/lib/apiClient";

export const api = createApiClient({
  fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
});
