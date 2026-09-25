import type { NewsMark } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { creditAuthorHref } from "@/data/creditAuthors";
import { Link } from "@/i18n/navigation";
import { GROUP_HUBS } from "@/lib/groupHubs";
import { contentEditorAttributes } from "@/lib/contentEditorAttributes";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

export function NewsRichText({
  articleId,
  blockIndex,
  editable,
  locale,
  parts,
  sectionIndex,
}: {
  articleId: string;
  blockIndex: number;
  editable: boolean;
  locale: AppLocale;
  parts: NewsMark[];
  sectionIndex: number;
}) {
  return (
    <>
      {parts.map((mark, index) => (
        <NewsMarkNode
          editorField={`sections.${sectionIndex}.blocks.${blockIndex}.parts.${index}`}
          editorId={editable ? articleId : undefined}
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
  if (mark.type === "credit-author") return `author:${index}:${mark.slug}`;
  if (mark.type === "external") return `ext:${index}:${mark.href}`;
  if (mark.type === "hub") return `hub:${index}:${mark.id}`;
  if (mark.type === "region") return `region:${index}:${mark.id}`;
  if (mark.type === "news-index") return `news:${index}`;
  return `sp:${index}:${mark.id}`;
}

function NewsMarkNode({
  editorField,
  editorId,
  locale,
  mark,
}: {
  editorField: string;
  editorId?: string;
  locale: AppLocale;
  mark: NewsMark;
}) {
  if (typeof mark === "string")
    return (
      <span {...contentEditorAttributes("news", editorId, editorField)}>
        <PhoneLinkedText>{mark}</PhoneLinkedText>
      </span>
    );

  if (mark.type === "sci") {
    return (
      <i {...contentEditorAttributes("news", editorId, `${editorField}.name`)}>
        {mark.name}
      </i>
    );
  }

  if (mark.type === "external") {
    return (
      <a
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        {...contentEditorAttributes("news", editorId, `${editorField}.label`)}
        href={mark.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {mark.label}
      </a>
    );
  }

  if (mark.type === "credit-author") {
    return (
      <Link
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        {...contentEditorAttributes("news", editorId, `${editorField}.label`)}
        href={creditAuthorHref(mark.slug)}
      >
        {mark.label}
      </Link>
    );
  }

  if (mark.type === "news-index") {
    return (
      <Link
        className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
        {...contentEditorAttributes("news", editorId, `${editorField}.label`)}
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
        {...contentEditorAttributes("news", editorId, `${editorField}.label`)}
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
        {...contentEditorAttributes("news", editorId, `${editorField}.label`)}
        href={regionHref(mark.id)}
      >
        {mark.label}
      </Link>
    );
  }

  return (
    <Link
      className="text-foreground underline decoration-foreground/20 underline-offset-[3px] transition-colors hover:decoration-primary"
      {...contentEditorAttributes("news", editorId, `${editorField}.label`)}
      href={speciesHref(mark.id, locale)}
    >
      {mark.label}
    </Link>
  );
}
