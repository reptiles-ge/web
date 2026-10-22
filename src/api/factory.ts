import { createFactory } from "hono/factory";

import type { ApiEnv } from "./env";

export const factory = createFactory<ApiEnv>();
