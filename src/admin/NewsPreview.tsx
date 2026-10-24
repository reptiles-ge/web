import { Divider, Typography } from "antd";

import type { NewsMark, NewsPhoto, NewsSection } from "@/data/newsTypes";
import type { AppLocale } from "@/i18n/routing";

import { optimizedImgSrc } from "@/data/optimizedImages";

import type { AdminNewsRecord } from "./news";

type Article = AdminNewsRecord["article"];

export function NewsPreview({
  article,
  copy,
  locale,
  photos,
}: {
  article: Article;
  copy: Omit<Article["copy"]["ka"], "sections"> & { sections: NewsSection[] };
  locale: AppLocale;
  photos: ReadonlyMap<string, NewsPhoto>;
}) {
  return (
    <article className="news-preview" lang={locale}>
      <Typography.Title level={1} style={{ marginTop: 0 }}>
        {copy.title}
      </Typography.Title>
      <Typography.Paragraph style={{ fontSize: 18 }} type="secondary">
        {copy.dek}
      </Typography.Paragraph>
      {article.image ? (
        <PreviewFigure locale={locale} photo={article.image as NewsPhoto} />
      ) : null}
      <Typography.Paragraph strong style={{ fontSize: 17 }}>
        {copy.lead}
      </Typography.Paragraph>
      {copy.sections.map((section, index) => (
        <section key={index}>
          <Typography.Title level={2} style={{ fontSize: 22 }}>
            {section.heading}
          </Typography.Title>
          {section.blocks.map((block, at) =>
            block.type === "figure" ? (
              <PreviewFigure
                key={at}
                locale={locale}
                photo={
                  photos.get(block.src) ?? { alt: { ka: "" }, src: block.src }
                }
              />
            ) : (
              <Typography.Paragraph key={at}>
                {block.parts.map((part, partIndex) => (
                  <PreviewMark key={partIndex} part={part} />
                ))}
              </Typography.Paragraph>
            ),
          )}
        </section>
      ))}
      <Divider />
      <Typography.Title level={5}>Sources</Typography.Title>
      <ul>
        {article.sources.map((source) => (
          <li key={source.url}>
            <Typography.Link href={source.url} rel="noreferrer" target="_blank">
              {typeof source.name === "string"
                ? source.name
                : (source.name[locale] ?? source.name.ka)}
            </Typography.Link>
          </li>
        ))}
      </ul>
    </article>
  );
}

function PreviewFigure({
  locale,
  photo,
}: {
  locale: AppLocale;
  photo: NewsPhoto;
}) {
  const alt = photo.alt[locale] ?? photo.alt.ka;
  const credit = [photo.credit?.photographer, photo.credit?.location]
    .filter(Boolean)
    .join(" · ");
  return (
    <figure>
      <img alt={alt} src={optimizedImgSrc(photo.src, 1200)} />
      <figcaption>
        {alt}
        {credit ? ` — ${credit}` : ""}
      </figcaption>
    </figure>
  );
}

function PreviewMark({ part }: { part: NewsMark }) {
  if (typeof part === "string") return <>{part}</>;
  if (part.type === "sci") return <i>{part.name}</i>;
  if (part.type === "external") {
    return (
      <Typography.Link href={part.href} rel="noreferrer" target="_blank">
        {part.label}
      </Typography.Link>
    );
  }
  const target =
    part.type === "credit-author"
      ? part.slug
      : part.type === "news-index"
        ? "news index"
        : part.id;
  return (
    <span
      className={`news-link news-link--${part.type}`}
      style={{ textDecoration: "underline", textUnderlineOffset: 3 }}
      title={`${part.type}: ${target}`}
    >
      {part.label}
    </span>
  );
}
