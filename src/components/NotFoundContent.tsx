import { CoverImage } from "@/components/CoverImage";
import { NotFoundAnalytics } from "@/components/NotFoundAnalytics";
import { images } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const pathways = [
  { href: "/snakes" as const, key: "snakes" as const },
  { href: "/species" as const, key: "species" as const },
  { href: "/regions" as const, key: "regions" as const },
  { href: "/venomous-snakes" as const, key: "venomous" as const },
] as const;

export async function NotFoundContent() {
  const t = await getTranslations("notFound");

  return (
    <main
      data-hide-footer
      className="relative flex min-h-svh flex-col overflow-hidden bg-ink text-ink-foreground"
    >
      <NotFoundAnalytics />
      <div className="absolute inset-0">
        <CoverImage
          src={images.cta}
          alt={t("imageAlt")}
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/55 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_20%,transparent_10%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-16 lg:px-10 lg:py-24"
        style={{
          paddingTop: "6rem",
        }}
      >
        {" "}
        <p className="font-display text-[clamp(4.5rem,18vw,11rem)] leading-none font-semibold tracking-tight text-white/8">
          404
        </p>
        <div className="-mt-6 max-w-2xl sm:-mt-10 lg:-mt-14">
          <p className="text-[11px] font-medium tracking-[0.32em] text-white/45 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-balance-tight mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] font-semibold text-white">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/60 sm:mt-6 sm:text-[16px]">
            {t("body")}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              {t("home")}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/regions"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[14px] font-medium text-white/90 backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/10"
            >
              {t("regions")}
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[24px] bg-white/10 sm:mt-20 sm:grid-cols-3">
          {pathways.map((pathway) => (
            <Link
              key={pathway.key}
              href={pathway.href}
              className="group flex min-h-[140px] flex-col justify-between bg-ink/80 p-6 backdrop-blur-md transition-colors hover:bg-ink/60 sm:p-7"
            >
              <p className="text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
                {t(`paths.${pathway.key}.eyebrow`)}
              </p>
              <div className="mt-8 flex items-end justify-between gap-3">
                <p className="font-display text-[1.15rem] leading-tight font-semibold text-white sm:text-[1.25rem]">
                  {t(`paths.${pathway.key}.title`)}
                </p>
                <ArrowUpRight className="size-4 shrink-0 text-white/45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
