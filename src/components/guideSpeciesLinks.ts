import type { ComponentProps } from "react";

import type { Link } from "@/i18n/navigation";

export type GuideSpeciesLink = {
  href: ComponentProps<typeof Link>["href"];
  id: string;
  label: string;
};

export function guideSpeciesLinks<Key extends string>(
  links: readonly { href: GuideSpeciesLink["href"]; key: Key }[],
  label: (key: Key) => string,
): GuideSpeciesLink[] {
  return links.map((link) => ({
    href: link.href,
    id: link.key,
    label: label(link.key),
  }));
}
