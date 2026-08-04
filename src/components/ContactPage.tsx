"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const topics = ["mistake", "idea", "hello"] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 + i * 0.07,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function mailto(subject?: string) {
  const base = `mailto:${siteConfig.email}`;
  if (!subject) return base;
  return `${base}?subject=${encodeURIComponent(subject)}`;
}

export function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink text-ink-foreground">
      <div className="absolute inset-0">
        <Image
          src={images.cta}
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[color-mix(in_oklab,var(--ink)_92%,black)]" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,transparent_20%,rgba(0,0,0,0.55)_100%)]" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }}
        />
      </div>

      <header
        className="relative z-20"
        style={{ paddingTop: "var(--beta-banner-height, 0px)" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-5 lg:px-10">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo
              size={44}
              priority
              showWordmark
              wordmarkClassName="hidden text-[17px] text-white sm:inline"
            />
          </Link>
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <ThemeToggle variant="dark" />
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100svh-5.5rem)] items-center">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[13px] text-white/55 transition-colors hover:text-white"
              >
                <ArrowLeft className="size-3.5" />
                {t("back")}
              </Link>
            </motion.div>

            <motion.p
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-10 font-display text-[clamp(2.4rem,7vw,3.75rem)] font-semibold leading-none tracking-tight text-white"
            >
              {t("brand")}
            </motion.p>

            <motion.h1
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-5 font-display text-[clamp(1.65rem,4.5vw,2.35rem)] font-medium leading-tight text-white/92"
            >
              {t("title")}
            </motion.h1>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60"
            >
              {t("body")}
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-12"
            >
              <p className="text-[11px] tracking-[0.22em] text-white/40">
                {t("emailLabel")}
              </p>
              <a
                href={mailto()}
                className="group mt-3 inline-flex items-center gap-2 border-b border-white/25 pb-1 text-[clamp(1.15rem,3vw,1.55rem)] font-medium text-white transition-colors hover:border-white/70"
              >
                {siteConfig.email}
                <ArrowUpRight className="size-4 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </a>
              <p className="mt-4 text-[13px] text-white/40">{t("replyNote")}</p>
            </motion.div>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-14 border-t border-white/10 pt-8"
            >
              <p className="text-[11px] tracking-[0.22em] text-white/40">
                {t("topicsLabel")}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {topics.map((topic) => (
                  <li key={topic}>
                    <a
                      href={mailto(t(`subjects.${topic}`))}
                      className="group inline-flex items-center gap-2 text-[14px] text-white/70 transition-colors hover:text-white"
                    >
                      <span className="h-px w-4 bg-white/30 transition-all group-hover:w-7 group-hover:bg-white/70" />
                      {t(`topics.${topic}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
