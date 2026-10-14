import type { ReactNode } from "react";

import { SpeciesInlineLink } from "@/components/SpeciesInlineLink";
import { Link } from "@/i18n/navigation";

const guideLinkClassName =
  "font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";

export const snakeGuideLeadLinks = {
  kaznakovi: (chunks: ReactNode) => (
    <SpeciesInlineLink id="vipera-kaznakovi">{chunks}</SpeciesInlineLink>
  ),
  venomous: (chunks: ReactNode) => (
    <Link className={guideLinkClassName} href="/venomous-snakes">
      {chunks}
    </Link>
  ),
};
