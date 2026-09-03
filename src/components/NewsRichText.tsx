import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { NewsMark } from "@/data/newsTypes";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

function NewsMarkNode({
  mark,
  locale,
}: {
  mark: NewsMark;
  locale: AppLocale;
}) {
  if (typeof mark === "string") return mark;

  if (mark.type === "sci") {
    return <i>{mark.name}</i>;
  }

  if (mark.type === "external") {
    return (
      <a
        href={mark.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
      >
        {mark.label}
      </a>
    );
  }

  if (mark.type === "news-index") {
    return (
      <Link
        href="/news"
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
      >
        {mark.label}
      </Link>
    );
  }

  if (mark.type === "hub") {
    return (
      <Link
        href={GROUP_HUBS[mark.id].path}
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
      >
        {mark.label}
      </Link>
    );
  }

  if (mark.type === "region") {
    return (
      <Link
        href={regionHref(mark.id)}
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
      >
        {mark.label}
      </Link>
    );
  }

  return (
    <Link
      href={speciesHref(mark.id, locale)}
      className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
    >
      {mark.label}
    </Link>
  );
}

export function NewsRichText({
  parts,
  locale,
}: {
  parts: NewsMark[];
  locale: AppLocale;
}) {
  return (
    <>
      {parts.map((mark, index) => (
        <NewsMarkNode
          key={newsMarkKey(mark, index)}
          mark={mark}
          locale={locale}
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
