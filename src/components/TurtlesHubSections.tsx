"use client";

import type { ReactNode } from "react";

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

const turtleWhereCards = [
  {
    key: "testudo",
    regions: [
      { id: "shida-kartli", labelKey: "regionShidaKartli" },
      { id: "kvemo-kartli", labelKey: "regionKvemoKartli" },
      { id: "kakheti", labelKey: "regionKakheti" },
      { id: "tbilisi", labelKey: "regionTbilisi" },
    ],
  },
  {
    key: "emys",
    regions: [
      {
        id: "samegrelo-zemo-svaneti",
        labelKey: "regionSamegrelo",
      },
    ],
  },
  {
    key: "mauremys",
    regions: [{ id: "tbilisi", labelKey: "regionTbilisi" }],
  },
  {
    key: "trachemys",
    regions: [
      { id: "tbilisi", labelKey: "regionTbilisi" },
      { id: "adjara", labelKey: "regionAdjara" },
    ],
  },
] as const;

type BasicArticleName =
  "conservation" | "diet" | "lifespan" | "reproduction" | "shell" | "whatIs";
type BasicParagraph = "p1" | "p2" | "p3";

export function TurtlesHubSections() {
  return (
    <>
      <TurtleBasicsSection />
      <TurtleRangeSection />
      <TurtleWhereSection />
      <TurtleIdentifySection />
      <TurtleGuideCardsSection />
    </>
  );
}

function TurtleArticleIntro({
  body,
  title,
}: {
  body: ReactNode;
  title: string;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
      <div>
        <h2 className={turtleHeadingClass}>{title}</h2>
      </div>
      <div className={turtleTextClass}>
        {typeof body === "string" ? <p>{body}</p> : body}
      </div>
    </div>
  );
}

function TurtleBasicsSection() {
  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="space-y-16">
          <TurtleBasicTextArticle
            name="whatIs"
            paragraphs={["p1", "p2"]}
            separated={false}
          />
          <TurtleBasicTextArticle
            name="shell"
            paragraphs={["p1", "p2", "p3"]}
          />
          <TurtleTypesArticle />
          <TurtleBasicTextArticle name="diet" paragraphs={["p1", "p2"]} />
          <TurtleBasicTextArticle name="lifespan" paragraphs={["p1", "p2"]} />
          <TurtleBasicTextArticle
            name="reproduction"
            paragraphs={["p1", "p2"]}
          />
          <TurtleGeorgiaComparisonArticle />
          <TurtleBasicTextArticle
            name="conservation"
            paragraphs={["p1", "p2"]}
          />
        </div>
      </div>
    </section>
  );
}

function TurtleBasicTextArticle({
  name,
  paragraphs,
  separated = true,
}: {
  name: BasicArticleName;
  paragraphs: readonly BasicParagraph[];
  separated?: boolean;
}) {
  const t = useTranslations("turtles");
  const articleClassName = separated
    ? "grid gap-8 border-t border-border pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20"
    : "grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20";

  return (
    <article className={articleClassName}>
      <div>
        <h2 className={turtleHeadingClass}>
          {t(`basics.${name}.title` as Parameters<typeof t>[0])}
        </h2>
      </div>
      <div className={turtleTextClass}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>
            {t(`basics.${name}.${paragraph}` as Parameters<typeof t>[0])}
          </p>
        ))}
      </div>
    </article>
  );
}

function TurtleGeorgiaComparisonArticle() {
  const t = useTranslations("turtles");

  return (
    <article className="border-t border-border pt-16">
      <TurtleArticleIntro
        body={
          <>
            <p>{t("basics.georgiaComparison.intro1")}</p>
            <p>{t("basics.georgiaComparison.intro2")}</p>
          </>
        }
        title={t("basics.georgiaComparison.title")}
      />
      <div className={tableWrapperClass}>
        <table className={tableClass}>
          <thead className={tableHeadClass}>
            <tr>
              {(
                [
                  "species",
                  "type",
                  "status",
                  "traits",
                  "habitat",
                  "conservation",
                ] as const
              ).map((column) => (
                <th className={tableHeadCellClass} key={column} scope="col">
                  {t(`basics.georgiaComparison.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {georgiaRows.map((row) => (
              <TurtleGeorgiaComparisonRow key={row} row={row} />
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
        {t.rich("basics.georgiaComparison.note", {
          identify: (chunks) => (
            <Link className={regionLinkClass} href="/turtles/identifikacia">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </article>
  );
}

function TurtleGeorgiaComparisonRow({
  row,
}: {
  row: (typeof georgiaRows)[number];
}) {
  const t = useTranslations("turtles");

  return (
    <tr>
      <th className={tableRowHeaderClass} scope="row">
        <span className="block">
          {t(`basics.georgiaComparison.rows.${row}.species`)}
        </span>
        <span className="mt-1 block text-[13px] font-normal text-muted-foreground italic">
          {t(`basics.georgiaComparison.rows.${row}.scientific`)}
        </span>
      </th>
      {(["type", "status", "traits", "habitat", "conservation"] as const).map(
        (column) => (
          <td className={tableCellClass} key={column}>
            {t(`basics.georgiaComparison.rows.${row}.${column}`)}
          </td>
        ),
      )}
    </tr>
  );
}

function TurtleGuideCard({
  body,
  cta,
  eyebrow,
  href,
  title,
}: {
  body: string;
  cta: string;
  eyebrow: string;
  href: "/turtles/tsqlis-kuebi" | "/turtles/xmelis-kuebi";
  title: string;
}) {
  return (
    <div className="contents">
      <div className="flex h-full flex-col justify-between bg-card p-8 sm:p-10">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-5 font-display text-display-title font-semibold">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {body}
          </p>
        </div>
        <Link
          className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
          href={href}
        >
          {cta}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function TurtleGuideCardsSection() {
  const t = useTranslations("turtles");

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-px overflow-hidden rounded-card bg-border/80 lg:grid-cols-2">
          <TurtleGuideCard
            body={t("landBody")}
            cta={t("landCta")}
            eyebrow={t("landEyebrow")}
            href="/turtles/xmelis-kuebi"
            title={t("landTitle")}
          />
          <TurtleGuideCard
            body={t("waterBody")}
            cta={t("waterCta")}
            eyebrow={t("waterEyebrow")}
            href="/turtles/tsqlis-kuebi"
            title={t("waterTitle")}
          />
        </div>
      </div>
    </section>
  );
}

function TurtleIdentifySection() {
  const t = useTranslations("turtles");

  return (
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
  );
}

function TurtleRangeSection() {
  const t = useTranslations("turtles");

  return (
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
  );
}

function TurtleTypesArticle() {
  const t = useTranslations("turtles");

  return (
    <article className="border-t border-border pt-16">
      <TurtleArticleIntro
        body={t("basics.types.intro")}
        title={t("basics.types.title")}
      />
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
            <Link className={regionLinkClass} href="/turtles/tsqlis-kuebi">
              {chunks}
            </Link>
          ),
          land: (chunks) => (
            <Link className={regionLinkClass} href="/turtles/xmelis-kuebi">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </article>
  );
}

function TurtleWhereSection() {
  const t = useTranslations("turtles");

  return (
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
          {turtleWhereCards.map((item) => (
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
  );
}
