import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

export const { getPathname, Link, usePathname, useRouter } =
  createNavigation(routing);
