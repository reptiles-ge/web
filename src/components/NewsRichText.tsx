import type { NewsMark } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

export function NewsRichText({
  locale,
  parts,
}: {
  locale: AppLocale;
  parts: NewsMark[];
}) {
  return (
    <>
      {parts.map((mark, index) => (
        <NewsMarkNode
          key={newsMarkKey(mark, index)}
          locale={locale}
          mark={mark}
        />
      ))}
    </>
  );
}

function newsMarkKey(mark: NewsMark, index: number) {
  if (typeof mark === "string") return `t:${index}:${mark}`;
  if (mark.type === "sci") return `sci:${index}:${mark.name}`;
  if (mark.type === "external") return `ext:${index}:${mark.href}`;
  if (mark.type === "hub") return `hub:${index}:${mark.id}`;
  if (mark.type === "region") return `region:${index}:${mark.id}`;
  if (mark.type === "news-index") return `news:${index}`;
  return `sp:${index}:${mark.id}`;
}

function NewsMarkNode({ locale, mark }: { locale: AppLocale; mark: NewsMark }) {
  if (typeof mark === "string") return mark;

  if (mark.type === "sci") {
    return <i>{mark.name}</i>;
  }

  if (mark.type === "external") {
    return (
      <a
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        href={mark.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {mark.label}
      </a>
    );
  }

  if (mark.type === "news-index") {
    return (
      <Link
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        href="/news"
      >
        {mark.label}
      </Link>
    );
  }

  if (mark.type === "hub") {
    return (
      <Link
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        href={GROUP_HUBS[mark.id].path}
      >
        {mark.label}
      </Link>
    );
  }

  if (mark.type === "region") {
    return (
      <Link
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        href={regionHref(mark.id)}
      >
        {mark.label}
      </Link>
    );
  }

  return (
    <Link
      className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
      href={speciesHref(mark.id, locale)}
    >
      {mark.label}
    </Link>
  );
}
