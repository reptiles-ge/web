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
        <NewsMarkNode key={index} mark={mark} locale={locale} />
      ))}
    </>
  );
}

export function newsPlainText(parts: NewsMark[]): string {
  return parts
    .map((mark) => {
      if (typeof mark === "string") return mark;
      if (mark.type === "sci") return mark.name;
      return mark.label;
    })
    .join("");
}

export function NewsParagraphs({
  paragraphs,
  locale,
  className,
}: {
  paragraphs: NewsMark[][];
  locale: AppLocale;
  className?: string;
}): ReactNode {
  return paragraphs.map((parts, index) => (
    <p key={index} className={className}>
      <NewsRichText parts={parts} locale={locale} />
    </p>
  ));
}
