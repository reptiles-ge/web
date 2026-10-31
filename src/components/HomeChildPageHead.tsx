import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { JsonLd } from "@/components/JsonLd";
import { ScreenReaderBreadcrumb } from "@/components/ScreenReaderBreadcrumb";
import { homeChildBreadcrumbLd } from "@/lib/pageStructuredData";

type HomeChildPageHeadProps = {
  locale: AppLocale;
  name: string;
  page: Record<string, unknown>;
  path: Parameters<typeof homeChildBreadcrumbLd>[1];
};

export async function HomeChildPageHead({
  locale,
  name,
  page,
  path,
}: HomeChildPageHeadProps) {
  const [tShared, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "groupHubShared" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  const home = tShared("breadcrumbHome");

  return (
    <>
      <JsonLd
        data={[page, homeChildBreadcrumbLd(locale, path, { home, name })]}
      />
      <ScreenReaderBreadcrumb
        current={name}
        home={home}
        label={tNav("breadcrumbAria")}
      />
    </>
  );
}
