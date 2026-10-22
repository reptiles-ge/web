import { z } from "zod";

import { localeQuery } from "./common";

export const catalogQuery = z.object({
  locale: localeQuery,
  view: z.enum(["card", "full"]).default("card"),
});
