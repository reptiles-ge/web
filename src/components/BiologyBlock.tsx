import { getTranslations } from "next-intl/server";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { BiologyExpandable } from "@/components/BiologyExpandable";

type BiologyBlockProps = {
  body: string;
  headingId?: string;
  title: string;
};

const PREVIEW_LENGTH = 140;

export async function BiologyBlock({
  body,
  headingId,
  title,
}: BiologyBlockProps) {
  const t = await getTranslations("profile");
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
        needsExpand={needsExpand}
        readLess={t("readLess")}
        readMore={t("readMore")}
      />
    </div>
  );
}
