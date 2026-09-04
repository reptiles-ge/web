import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { ClusterGuideLead } from "@/components/ClusterGuideLead";
import { ClusterPageFrame } from "@/components/ClusterPageFrame";
import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_RELATED,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { CoverImage } from "@/components/CoverImage";
import { Link } from "@/i18n/navigation";
import {
  type ClusterGuideViewProps,
  GLASS_LIZARD_COMPARE_IDS,
  orderSpeciesByIds,
} from "@/lib/clusterGuides";
import { getSpeciesSizeStat } from "@/lib/speciesContent";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { speciesHref } from "@/lib/speciesRoutes";

export async function LizardComparePage({
  guideId,
  heroSrc,
  species,
}: ClusterGuideViewProps) {
  const t = await getTranslations("lizardCompare");
  const locale = (await getLocale()) as AppLocale;
  const ordered = orderSpeciesByIds(species, GLASS_LIZARD_COMPARE_IDS);
  const glass = ordered.find((item) => item.id === "pseudopus-apodus");
  const slowWorm = ordered.find((item) => item.id === "anguis-colchica");
  const grassSnake = ordered.find((item) => item.id === "natrix-natrix");
  const diceSnake = ordered.find((item) => item.id === "natrix-tessellata");
  const dash = t("emDash");
  const columns = [glass, slowWorm, grassSnake].filter(
    (item): item is Species => Boolean(item),
  );

  return (
    <ClusterPageFrame ctaHash="#compare" guideId={guideId} heroSrc={heroSrc}>
      <ClusterGuideLead
        body={
          <>
            <p>{t("guideP1")}</p>
            <p>{t("guideP2")}</p>
          </>
        }
        eyebrow={t("guideEyebrow")}
        title={t("guideTitle")}
      />

      <section
        className="scroll-mt-28 border-t border-border bg-surface py-20 lg:py-28"
        id="compare"
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              body={t("tableBody")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("tableEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("tableTitle")}
              titleClassName={CLUSTER_TITLE_SECTION}
            />
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {columns.map((item) => (
              <div key={item.id}>
                <CompareCard
                  locale={locale}
                  role={t(`role.${roleKey(item.id)}`)}
                  size={getSpeciesSizeStat(item) ?? dash}
                  species={item}
                />
              </div>
            ))}
          </div>

          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[640px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  <th className="py-4 pr-4 font-medium">{t("col.trait")}</th>
                  {columns.map((item) => (
                    <th className="py-4 pr-4 font-medium" key={item.id}>
                      {item.commonName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                  <tr
                    className="border-b border-border/80 last:border-b-0"
                    key={n}
                  >
                    <td className="py-4 pr-4 font-display text-[15px] font-medium">
                      {t(`row${n}Label`)}
                    </td>
                    {columns.map((item) => (
                      <td
                        className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground"
                        key={`${item.id}-${n}`}
                      >
                        {t(`row${n}.${roleKey(item.id)}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {diceSnake ? (
        <section className="border-t border-border bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div>
              <ClusterSectionIntro
                body={t("alsoBody")}
                bodyClassName={CLUSTER_BODY}
                eyebrow={t("alsoEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("alsoTitle")}
                titleClassName={CLUSTER_TITLE_RELATED}
              >
                <Link
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
                  href={speciesHref(diceSnake.id, locale)}
                >
                  {diceSnake.commonName}
                  <ArrowUpRight className="size-4" />
                </Link>
              </ClusterSectionIntro>
            </div>
          </div>
        </section>
      ) : null}
    </ClusterPageFrame>
  );
}

function CompareCard({
  locale,
  role,
  size,
  species,
}: {
  locale: AppLocale;
  role: string;
  size: string;
  species: Species;
}) {
  return (
    <Link
      className="group block overflow-hidden rounded-card border border-border bg-card"
      href={speciesHref(species.id, locale)}
    >
      <span className="relative block aspect-5/4 bg-ink">
        <CoverImage
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 33vw"
          src={species.image}
        />
      </span>
      <span className="block p-5">
        <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
          {role}
        </span>
        <span className="mt-2 block font-display text-[20px] leading-tight font-semibold text-foreground transition-colors group-hover:text-primary">
          {species.commonName}
        </span>
        <span className="mt-1 block text-[13px] text-muted-foreground italic">
          {species.scientificName}
        </span>
        <span className="mt-3 block text-[13px] text-muted-foreground">
          {size}
        </span>
      </span>
    </Link>
  );
}

function roleKey(id: string) {
  if (id === "pseudopus-apodus") return "glass";
  if (id === "anguis-colchica") return "slow";
  return "snake";
}
