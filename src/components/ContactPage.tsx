"use client";

import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[44svh] overflow-hidden bg-ink lg:min-h-svh">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            <Image
              src={images.cta}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/5 to-black/35 lg:bg-gradient-to-r lg:from-black/30 lg:via-black/5 lg:to-transparent" />
        </div>

        <main className="relative flex flex-col justify-center bg-background">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(ellipse 75% 55% at 85% 0%, color-mix(in oklab, var(--primary) 11%, transparent), transparent 58%), radial-gradient(ellipse 55% 45% at 0% 100%, color-mix(in oklab, var(--gold) 9%, transparent), transparent 52%)",
            }}
          />

          <div
            className="relative z-10 mx-auto w-full max-w-lg px-6 py-14 sm:px-10 lg:px-14 lg:py-24 xl:px-20"
            style={{
              paddingTop: "5.5rem",
            }}
          >
            {" "}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                {t("back")}
              </Link>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease }}
              className="mt-12 font-display text-[clamp(2.8rem,8vw,4.25rem)] font-semibold leading-[0.95] tracking-tight"
            >
              {t("brand")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-5 font-display text-[clamp(1.45rem,3.5vw,1.9rem)] font-medium leading-snug text-foreground/75"
            >
              {t("title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease }}
              className="mt-7 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground"
            >
              {t("body")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38, ease }}
              className="mt-12"
            >
              <a
                href="mailto:nika@shamiladze.com"
                className="group inline-flex max-w-full items-center gap-3"
              >
                <span className="truncate border-b border-foreground/20 pb-1 font-display text-[clamp(1.05rem,2.8vw,1.35rem)] font-medium transition-colors group-hover:border-primary group-hover:text-primary">
                  nika@shamiladze.com
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href="/about"
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("about")}
                </Link>
                <Link
                  href="/species"
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("species")}
                </Link>
                <Link
                  href="/snakes"
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("snakes")}
                </Link>
                <Link
                  href="/venomous-snakes"
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {t("venomous")}
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
