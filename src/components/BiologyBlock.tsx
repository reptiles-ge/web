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
    <div className="rounded-[22px] bg-card p-5 shadow-[0_10px_26px_rgba(14,20,17,0.05)] lg:rounded-[28px] lg:px-7 lg:py-[26px]">
      <AnchoredHeading
        anchorLabel={t("anchorLink")}
        as="h3"
        className="font-display text-[19px] font-semibold lg:text-[20px]"
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
