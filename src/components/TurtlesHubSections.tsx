"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_GUIDE,
  CLUSTER_TITLE_RELATED,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { Link } from "@/i18n/navigation";

const regionLinkClass =
  "text-foreground underline decoration-foreground/45 underline-offset-4 hover:decoration-foreground";
const turtleTextClass =
  "space-y-4 text-[15px] leading-relaxed text-muted-foreground";
const turtleHeadingClass =
  "font-display text-[28px] font-semibold leading-tight text-foreground sm:text-[34px]";
const tableWrapperClass =
  "mt-6 overflow-x-auto rounded-card border border-border bg-card";
const tableClass = "w-full min-w-[760px] border-collapse text-left text-[14px]";
const tableHeadClass =
  "border-b border-border bg-surface text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase";
const tableHeadCellClass = "px-4 py-3 align-bottom";
const tableCellClass = "border-b border-border px-4 py-4 align-top";
const tableRowHeaderClass =
  "border-b border-border px-4 py-4 align-top font-medium text-foreground";
const typeRows = ["land", "freshwater", "sea"] as const;
const georgiaRows = ["testudo", "emys", "mauremys", "trachemys"] as const;

export function TurtlesHubSections() {
  const t = useTranslations("turtles");

  return (
    <>
      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="space-y-16">
            <article className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className={turtleHeadingClass}>
                  {t("basics.whatIs.title")}
                </h2>
              </div>
              <div className={turtleTextClass}>
                <p>{t("basics.whatIs.p1")}</p>
                <p>{t("basics.whatIs.p2")}</p>
              </div>
            </article>

            <article className="grid gap-8 border-t border-border pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className={turtleHeadingClass}>
                  {t("basics.shell.title")}
                </h2>
              </div>
              <div className={turtleTextClass}>
                <p>{t("basics.shell.p1")}</p>
                <p>{t("basics.shell.p2")}</p>
                <p>{t("basics.shell.p3")}</p>
              </div>
            </article>

            <article className="border-t border-border pt-16">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
                <div>
                  <h2 className={turtleHeadingClass}>
                    {t("basics.types.title")}
                  </h2>
                </div>
                <div className={turtleTextClass}>
                  <p>{t("basics.types.intro")}</p>
                </div>
              </div>
              <div className={tableWrapperClass}>
                <table className={tableClass}>
                  <thead className={tableHeadClass}>
                    <tr>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.types.columns.type")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.types.columns.habitat")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.types.columns.shell")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.types.columns.limbs")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.types.columns.adaptations")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeRows.map((row) => (
                      <tr key={row}>
                        <th className={tableRowHeaderClass} scope="row">
                          {t(`basics.types.rows.${row}.type`)}
                        </th>
                        <td className={tableCellClass}>
                          {t(`basics.types.rows.${row}.habitat`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(`basics.types.rows.${row}.shell`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(`basics.types.rows.${row}.limbs`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(`basics.types.rows.${row}.adaptations`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                {t.rich("basics.types.outro", {
                  freshwater: (chunks) => (
                    <Link
                      className={regionLinkClass}
                      href="/turtles/tsqlis-kuebi"
                    >
                      {chunks}
                    </Link>
                  ),
                  land: (chunks) => (
                    <Link
                      className={regionLinkClass}
                      href="/turtles/xmelis-kuebi"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </article>

            <article className="grid gap-8 border-t border-border pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className={turtleHeadingClass}>{t("basics.diet.title")}</h2>
              </div>
              <div className={turtleTextClass}>
                <p>{t("basics.diet.p1")}</p>
                <p>{t("basics.diet.p2")}</p>
              </div>
            </article>

            <article className="grid gap-8 border-t border-border pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className={turtleHeadingClass}>
                  {t("basics.lifespan.title")}
                </h2>
              </div>
              <div className={turtleTextClass}>
                <p>{t("basics.lifespan.p1")}</p>
                <p>{t("basics.lifespan.p2")}</p>
              </div>
            </article>

            <article className="grid gap-8 border-t border-border pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className={turtleHeadingClass}>
                  {t("basics.reproduction.title")}
                </h2>
              </div>
              <div className={turtleTextClass}>
                <p>{t("basics.reproduction.p1")}</p>
                <p>{t("basics.reproduction.p2")}</p>
              </div>
            </article>

            <article className="border-t border-border pt-16">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
                <div>
                  <h2 className={turtleHeadingClass}>
                    {t("basics.georgiaComparison.title")}
                  </h2>
                </div>
                <div className={turtleTextClass}>
                  <p>{t("basics.georgiaComparison.intro1")}</p>
                  <p>{t("basics.georgiaComparison.intro2")}</p>
                </div>
              </div>
              <div className={tableWrapperClass}>
                <table className={tableClass}>
                  <thead className={tableHeadClass}>
                    <tr>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.georgiaComparison.columns.species")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.georgiaComparison.columns.type")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.georgiaComparison.columns.status")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.georgiaComparison.columns.traits")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.georgiaComparison.columns.habitat")}
                      </th>
                      <th className={tableHeadCellClass} scope="col">
                        {t("basics.georgiaComparison.columns.conservation")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {georgiaRows.map((row) => (
                      <tr key={row}>
                        <th className={tableRowHeaderClass} scope="row">
                          <span className="block">
                            {t(`basics.georgiaComparison.rows.${row}.species`)}
                          </span>
                          <span className="mt-1 block text-[13px] font-normal text-muted-foreground italic">
                            {t(
                              `basics.georgiaComparison.rows.${row}.scientific`,
                            )}
                          </span>
                        </th>
                        <td className={tableCellClass}>
                          {t(`basics.georgiaComparison.rows.${row}.type`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(`basics.georgiaComparison.rows.${row}.status`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(`basics.georgiaComparison.rows.${row}.traits`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(`basics.georgiaComparison.rows.${row}.habitat`)}
                        </td>
                        <td className={tableCellClass}>
                          {t(
                            `basics.georgiaComparison.rows.${row}.conservation`,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                {t.rich("basics.georgiaComparison.note", {
                  identify: (chunks) => (
                    <Link
                      className={regionLinkClass}
                      href="/turtles/identifikacia"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </article>

            <article className="grid gap-8 border-t border-border pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <div>
                <h2 className={turtleHeadingClass}>
                  {t("basics.conservation.title")}
                </h2>
              </div>
              <div className={turtleTextClass}>
                <p>{t("basics.conservation.p1")}</p>
                <p>{t("basics.conservation.p2")}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div>
              <ClusterSectionIntro
                eyebrow={t("rangeEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("rangeTitle")}
                titleClassName={CLUSTER_TITLE_GUIDE}
              />
            </div>
            <div>
              <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                <p>{t("rangeP1")}</p>
                <p>
                  {t.rich("rangeP2", {
                    regions: (chunks) => (
                      <Link className={regionLinkClass} href="/regions">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div>
            <ClusterSectionIntro
              body={t("whereIntro")}
              bodyClassName={CLUSTER_BODY}
              eyebrow={t("whereEyebrow")}
              eyebrowClassName={CLUSTER_EYEBROW}
              title={t("whereTitle")}
              titleClassName={CLUSTER_TITLE_RELATED}
            />
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-card bg-border/80 sm:grid-cols-2">
            {(
              [
                {
                  key: "testudo",
                  regions: [
                    { id: "shida-kartli", labelKey: "regionShidaKartli" },
                    { id: "kvemo-kartli", labelKey: "regionKvemoKartli" },
                    { id: "kakheti", labelKey: "regionKakheti" },
                    { id: "tbilisi", labelKey: "regionTbilisi" },
                  ] as const,
                },
                {
                  key: "emys",
                  regions: [
                    {
                      id: "samegrelo-zemo-svaneti",
                      labelKey: "regionSamegrelo",
                    },
                  ] as const,
                },
                {
                  key: "mauremys",
                  regions: [
                    { id: "tbilisi", labelKey: "regionTbilisi" },
                  ] as const,
                },
                {
                  key: "trachemys",
                  regions: [
                    { id: "tbilisi", labelKey: "regionTbilisi" },
                    { id: "adjara", labelKey: "regionAdjara" },
                  ] as const,
                },
              ] as const
            ).map((item) => (
              <div className="contents" key={item.key}>
                <article className="flex h-full flex-col bg-card p-7 sm:p-8">
                  <h3 className="font-display text-[18px] font-semibold text-foreground sm:text-[20px]">
                    {t(`where.${item.key}.title`)}
                  </h3>
                  <p className="mt-1 text-[13px] text-muted-foreground italic">
                    {t(`where.${item.key}.scientific`)}
                  </p>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                    {t(`where.${item.key}.body`)}
                  </p>
                  <p className="mt-4 text-[12px] text-muted-foreground">
                    {item.regions.map((region, regionIndex) => (
                      <span key={region.id}>
                        {regionIndex > 0 ? " · " : null}
                        <Link
                          className={regionLinkClass}
                          href={{
                            params: { id: region.id },
                            pathname: "/regions/[id]",
                          }}
                        >
                          {t(region.labelKey)}
                        </Link>
                      </span>
                    ))}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-20">
            <div>
              <ClusterSectionIntro
                eyebrow={t("identifyEyebrow")}
                eyebrowClassName={CLUSTER_EYEBROW}
                title={t("identifyTitle")}
                titleClassName={CLUSTER_TITLE_GUIDE}
              />
            </div>
            <div>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {t("identifyBody")}
              </p>
            </div>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {([1, 2, 3, 4] as const).map((n) => (
              <li className="border-t border-border pt-4" key={n}>
                <p className="text-[12px] tracking-[0.18em] text-muted-foreground">
                  {String(n).padStart(2, "0")}
                </p>
                <p className="mt-3 font-display text-[17px] font-semibold text-foreground">
                  {t(`identifyPoint${n}Title`)}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {t(`identifyPoint${n}Body`)}
                </p>
              </li>
            ))}
          </ul>

          <div>
            <Link
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-ink-foreground transition-opacity hover:opacity-90"
              href="/turtles/identifikacia"
            >
              {t("identifyCta")}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid gap-px overflow-hidden rounded-card bg-border/80 lg:grid-cols-2">
            <div className="contents">
              <div className="flex h-full flex-col justify-between bg-card p-8 sm:p-10">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {t("landEyebrow")}
                  </p>
                  <h2 className="mt-5 font-display text-display-title font-semibold">
                    {t("landTitle")}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                    {t("landBody")}
                  </p>
                </div>
                <Link
                  className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href="/turtles/xmelis-kuebi"
                >
                  {t("landCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
            <div className="contents">
              <div className="flex h-full flex-col justify-between bg-card p-8 sm:p-10">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {t("waterEyebrow")}
                  </p>
                  <h2 className="mt-5 font-display text-display-title font-semibold">
                    {t("waterTitle")}
                  </h2>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                    {t("waterBody")}
                  </p>
                </div>
                <Link
                  className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href="/turtles/tsqlis-kuebi"
                >
                  {t("waterCta")}
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
