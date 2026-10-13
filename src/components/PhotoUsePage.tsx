import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { ContactMailto } from "@/components/ContactMailto";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/site";

const paragraphClass = "text-[15px] leading-7 text-foreground/82";
const headingClass =
  "pt-6 text-2xl font-semibold tracking-normal text-foreground";

export async function PhotoUsePage({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "photoUse" });
  const email = (
    <p className={paragraphClass}>
      <ContactMailto
        className="font-medium text-primary underline-offset-4 hover:underline"
        href={`mailto:${CONTACT_EMAIL}`}
      >
        {CONTACT_EMAIL}
      </ContactMailto>
    </p>
  );

  return (
    <div className="bg-background">
      <article className="mx-auto max-w-4xl space-y-6 px-6 pt-28 pb-16 text-foreground lg:px-10 lg:pt-32 lg:pb-20">
        <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className={paragraphClass}>{t("intro")}</p>

        <h2 className={headingClass}>{t("photosHeading")}</h2>
        <p className={paragraphClass}>{t("photosOwnership")}</p>
        <p className={paragraphClass}>{t("photosINaturalist")}</p>
        <p className={paragraphClass}>{t("photosThirdParty")}</p>
        <p className={paragraphClass}>{t("photosPermission")}</p>
        <p className={paragraphClass}>{t("askPermission")}</p>
        <p className={paragraphClass}>{t("authorRequest")}</p>
        {email}

        <h2 className={headingClass}>{t("textHeading")}</h2>
        <p className={paragraphClass}>{t("textBody")}</p>
        {email}
        <p className={paragraphClass}>
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href="/terms-and-conditions"
          >
            {t("termsLink")}
          </Link>
        </p>
      </article>
    </div>
  );
}
