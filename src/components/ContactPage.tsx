import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ContactMailto } from "@/components/ContactMailto";
import { CoverImage } from "@/components/CoverImage";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";

export async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[44svh] overflow-hidden bg-ink lg:min-h-svh">
          <div className="absolute inset-0">
            <CoverImage
              alt={t("imageAlt")}
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              src={images.cta}
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background via-black/5 to-black/35 lg:bg-linear-to-r lg:from-black/30 lg:via-black/5 lg:to-transparent" />
        </div>

        <div className="relative flex flex-col justify-center bg-background">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
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
            <Link
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              href="/"
            >
              <ArrowLeft className="size-3.5" />
              {t("back")}
            </Link>
            <p className="mt-12 font-display text-[clamp(2.8rem,8vw,4.25rem)] leading-[0.95] font-semibold tracking-tight">
              {t("brand")}
            </p>
            <h1 className="mt-5 font-display text-display-card font-medium text-foreground/75">
              {t("title")}
            </h1>
            <p className="mt-7 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
              {t("body")}
            </p>
            <div className="mt-12">
              <ContactMailto
                className="group inline-flex max-w-full items-center gap-3"
                href="mailto:nika@shamiladze.com"
              >
                <span className="truncate border-b border-foreground/20 pb-1 font-display text-[clamp(1.05rem,2.8vw,1.35rem)] font-medium transition-colors group-hover:border-primary group-hover:text-primary">
                  nika@shamiladze.com
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </ContactMailto>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  href="/about"
                >
                  {t("about")}
                </Link>
                <Link
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  href="/species"
                >
                  {t("species")}
                </Link>
                <Link
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  href="/snakes"
                >
                  {t("snakes")}
                </Link>
                <Link
                  className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  href="/venomous-snakes"
                >
                  {t("venomous")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
