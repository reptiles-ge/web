import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyExpandable } from "@/components/BiologyExpandable";

type BiologyBlockProps = {
  body: string;
  editable?: boolean;
  headingId?: string;
  locale: AppLocale;
  speciesId?: string;
  title: string;
};

const PREVIEW_LENGTH = 140;

export async function BiologyBlock({
  body,
  editable,
  headingId,
  locale,
  speciesId,
  title,
}: BiologyBlockProps) {
  const t = await getTranslations({ locale, namespace: "profile" });
  const needsExpand = body.length > PREVIEW_LENGTH;

  return (
    <div>
      <div className="h-px w-12 bg-gold" />
      <AnchoredHeading
        anchorLabel={t("anchorLink")}
        as="h3"
        className="mt-6 font-display text-[22px] font-medium"
        id={headingId}
        slugSource={title}
      >
        {title}
      </AnchoredHeading>
      <BiologyExpandable
        body={body}
        editorField={editable ? headingId : undefined}
        needsExpand={needsExpand}
        readLess={t("readLess")}
        readMore={t("readMore")}
        speciesId={editable ? speciesId : undefined}
      />
    </div>
  );
}
