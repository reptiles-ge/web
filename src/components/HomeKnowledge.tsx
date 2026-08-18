import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const pathways = [
  {
    key: "snakes" as const,
    href: "/snakes",
  },
  {
    key: "venomous" as const,
    href: "/venomous-snakes",
  },
  {
    key: "lizards" as const,
    href: "/lizards",
  },
  {
    key: "turtles" as const,
    href: "/turtles",
  },
  {
    key: "amphibians" as const,
    href: "/amphibians",
  },
  {
    key: "yard" as const,
    href: "/snakes-in-the-yard",
  },
] as const;

export async function HomeKnowledge() {
  const t = await getTranslations("home.knowledge");

  return (
    <section id="knowledge" className="bg-surface py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="mt-5 font-display text-balance-tight text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-border/80 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {pathways.map((pathway, index) => (
            <Link
              key={pathway.key}
              href={pathway.href}
              className="group relative flex min-h-[280px] flex-col justify-between bg-card p-8 transition-colors duration-300 hover:bg-background sm:p-10"
            >
              <div>
                <span className="font-display text-[13px] font-medium tracking-[0.2em] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold leading-tight text-foreground">
                  {t(`${pathway.key}.title`)}
                </h3>
                <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                  {t(`${pathway.key}.body`)}
                </p>
              </div>
              <span className="mt-10 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors group-hover:text-primary">
                {t(`${pathway.key}.cta`)}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
