import type { ComponentType, ReactNode } from "react";

import { ArrowRight, BookOpen, Info, Mail, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { ContactCopyButton } from "@/components/ContactCopyButton";
import { ContactMailto } from "@/components/ContactMailto";
import {
  type ContactTopic,
  ContactTopicPicker,
} from "@/components/ContactTopicPicker";
import { FacebookGlyph, InstagramGlyph } from "@/components/SocialGlyphs";
import { Link } from "@/i18n/navigation";
import { getCreditAuthorCards } from "@/lib/creditAuthors";
import { CONTACT_EMAIL, ORGANIZATION_SAME_AS } from "@/lib/site";

const TOPICS = [
  {
    id: "range",
    items: [
      "topics.range.items.species",
      "topics.range.items.place",
      "topics.range.items.date",
      "topics.range.items.photo",
    ],
  },
  {
    id: "fix",
    items: [
      "topics.fix.items.link",
      "topics.fix.items.what",
      "topics.fix.items.source",
    ],
  },
  {
    id: "photo",
    items: [
      "topics.photo.items.photo",
      "topics.photo.items.credit",
      "topics.photo.items.use",
    ],
  },
  {
    id: "other",
    items: ["topics.other.items.question", "topics.other.items.link"],
  },
] as const;

const SOCIAL_LINKS = [
  { href: ORGANIZATION_SAME_AS[0], icon: FacebookGlyph, label: "Facebook" },
  { href: ORGANIZATION_SAME_AS[1], icon: InstagramGlyph, label: "Instagram" },
] as const;

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-4 md:px-10 lg:px-[60px]";
const eyebrowClass =
  "text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) md:text-[11px]";
const darkButtonClass =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-(--nw-strong) font-semibold text-(--nw-on-strong) transition-opacity hover:opacity-90";

export async function ContactPage({ locale }: { locale: AppLocale }) {
  return (
    <div className="editorial-page min-h-screen bg-background text-(--nw-ink) antialiased">
      <ContactHero locale={locale} />
      <ContactTopics locale={locale} />
      <ContactShortcuts locale={locale} />
    </div>
  );
}

async function ContactHero({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const mailHref = `mailto:${CONTACT_EMAIL}`;

  return (
    <section className={`${wrapClass} pt-20 md:pt-[147px]`}>
      <div className="rounded-[28px] bg-(--nw-card) px-[22px] pt-7 pb-[22px] md:rounded-[36px] md:p-14 lg:grid lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <span className="hidden h-7 items-center rounded-full bg-(--nw-surface) px-3 text-[12.5px] font-semibold text-(--nw-accent) md:inline-flex">
            {t("brand")}
          </span>
          <h1 className="font-display text-[52px] leading-[0.98] font-semibold tracking-[-0.03em] md:mt-[22px] md:text-[96px] md:leading-[0.95] md:tracking-[-0.035em]">
            {t("title")}
          </h1>
          <p className="mt-3 text-[18px] leading-[1.4] text-(--nw-soft) md:mt-[18px] md:text-[22px]">
            {t("body")}
          </p>
        </div>
        <div className="mt-[26px] md:mt-12 lg:mt-0">
          <p className="text-[12.5px] text-(--nw-muted) md:text-[13px]">
            {t("emailLabel")}
          </p>
          <ContactMailto
            className="mt-1 block text-[25px] font-semibold tracking-[-0.01em] break-all md:mt-1.5 md:text-[40px] md:leading-[1.1] md:tracking-[-0.015em]"
            href={mailHref}
          >
            {CONTACT_EMAIL}
          </ContactMailto>
          <div className="mt-4 flex gap-2 md:mt-[22px] md:flex-wrap md:items-center md:gap-2.5">
            <ContactMailto
              className={`${darkButtonClass} h-[50px] flex-1 text-[15px] md:h-[52px] md:flex-none md:px-6`}
              href={mailHref}
            >
              <Mail aria-hidden="true" className="size-[17px]" />
              {t("write")}
            </ContactMailto>
            <ContactCopyButton
              copiedLabel={t("copied")}
              copyLabel={t("copy")}
              email={CONTACT_EMAIL}
              srLabel={t("copyLabel")}
            />
          </div>
          <div className="mt-2.5 flex gap-2 md:mt-6 md:items-center md:gap-2.5 md:border-t md:border-(--nw-line-soft) md:pt-[22px]">
            <span className="mr-1.5 hidden text-[13px] text-(--nw-muted) md:inline">
              {t("follow")}
            </span>
            {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
              <a
                className="inline-flex h-[46px] flex-1 items-center justify-center gap-2.5 rounded-full border border-(--nw-line) bg-(--nw-card) px-[18px] text-[14.5px] font-medium transition-colors hover:border-(--nw-sep) md:h-12 md:flex-none md:pl-3.5"
                href={href}
                key={label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="size-[18px]" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

async function ContactShortcuts({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const links: ReadonlyArray<{
    href: "/about" | "/snakes" | "/species" | "/venomous-snakes";
    icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
    label: string;
  }> = [
    { href: "/about", icon: Info, label: t("about") },
    { href: "/species", icon: BookOpen, label: t("species") },
    { href: "/snakes", icon: SnakeWave, label: t("snakes") },
    { href: "/venomous-snakes", icon: TriangleAlert, label: t("venomous") },
  ];

  return (
    <section className={`${wrapClass} pt-11 pb-14 md:pt-24 md:pb-28`}>
      <div className="px-1 md:px-0">
        <p className={eyebrowClass}>{t("beforeEyebrow")}</p>
        <h2 className="mt-2.5 text-[24px] leading-[1.15] font-semibold md:mt-3.5 md:text-[32px] md:tracking-[-0.015em]">
          {t("beforeTitle")}
        </h2>
      </div>
      <ul className="mt-3.5 flex flex-col gap-2 md:mt-6 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-4">
        {links.map(({ href, icon: Icon, label }) => (
          <li key={href}>
            <ShortcutLink
              href={href}
              icon={<Icon aria-hidden className="size-4 md:size-[18px]" />}
            >
              {label}
            </ShortcutLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function ContactTopics({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  const contributors = getCreditAuthorCards().length;
  const topics: ContactTopic[] = TOPICS.map(({ id, items }) => {
    const title = t(`topics.${id}.title`);
    return {
      id,
      includeLabel: t("includeLabel", { topic: title }),
      items: items.map((item) => t(item)),
      subject: t(`topics.${id}.subject`),
      summary: t(`topics.${id}.summary`),
      title,
    };
  });

  return (
    <section className={`${wrapClass} pt-11 md:pt-24`}>
      <div className="px-1 md:flex md:items-end md:justify-between md:gap-10 md:px-0">
        <div>
          <p className={eyebrowClass}>{t("topicsEyebrow")}</p>
          <h2 className="mt-2.5 text-[28px] leading-[1.12] font-semibold tracking-[-0.015em] md:mt-3.5 md:text-[40px] md:leading-[1.1] md:tracking-[-0.018em]">
            {t("topicsTitle")}
          </h2>
        </div>
        <p className="mt-2 text-[14px] leading-[1.55] text-(--nw-muted) md:hidden">
          {t("topicsIntroShort")}
        </p>
        <p className="hidden max-w-[420px] text-[15px] leading-[1.65] text-(--nw-muted) md:block">
          {t("topicsIntro")}
        </p>
      </div>
      <ContactTopicPicker
        draft={{
          greeting: t("draftGreeting"),
          label: t("draftLabel"),
          subject: t("draftSubject"),
          to: t("draftTo"),
        }}
        email={CONTACT_EMAIL}
        groupLabel={t("topicsLabel")}
        openLabel={t("open")}
        photoLinks={
          <PhotoLinks
            contributors={t("contributors", { count: contributors })}
            contributorsShort={t("contributorsShort", { count: contributors })}
            photoUse={t("photoUse")}
          />
        }
        topics={topics}
      />
    </section>
  );
}

function PhotoLinks({
  contributors,
  contributorsShort,
  photoUse,
}: {
  contributors: string;
  contributorsShort: string;
  photoUse: string;
}) {
  const linkClass =
    "inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-(--nw-accent) hover:underline md:gap-2 md:text-[14px]";
  const arrow = (
    <ArrowRight aria-hidden="true" className="size-3.5 md:size-[15px]" />
  );

  return (
    <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2 md:mt-4">
      <Link className={linkClass} href="/photo-use">
        {photoUse}
        {arrow}
      </Link>
      <Link className={linkClass} href="/authors">
        <span className="md:hidden">{contributorsShort}</span>
        <span className="hidden md:inline">{contributors}</span>
        {arrow}
      </Link>
    </div>
  );
}

function ShortcutLink({
  children,
  href,
  icon,
}: {
  children: ReactNode;
  href: "/about" | "/snakes" | "/species" | "/venomous-snakes";
  icon: ReactNode;
}) {
  return (
    <Link
      className="group flex items-center gap-3.5 rounded-[18px] bg-(--nw-card) px-4 py-3.5 motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 md:rounded-[20px] md:px-5 md:py-[18px] md:hover:shadow-[0_14px_32px_rgba(14,20,17,0.08)] md:motion-safe:hover:-translate-y-0.5"
      href={href}
    >
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-(--nw-surface) text-(--nw-accent) md:size-10 md:rounded-xl">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-[15px] font-semibold md:text-[15.5px]">
        {children}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-[15px] text-(--nw-sep) transition-colors group-hover:text-(--nw-accent) md:size-4"
      />
    </Link>
  );
}

function SnakeWave({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
    >
      <path d="M3 12c3-4 6 4 9 0s6 4 9 0" />
    </svg>
  );
}
