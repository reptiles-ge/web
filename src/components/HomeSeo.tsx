import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

const hubs = [
  { href: "/species", key: "species" as const },
  { href: "/snakes", key: "snakes" as const },
  { href: "/lizards", key: "lizards" as const },
  { href: "/turtles", key: "turtles" as const },
  { href: "/amphibians", key: "amphibians" as const },
  { href: "/birds", key: "birds" as const },
  { href: "/mammals", key: "mammals" as const },
  { href: "/spiders", key: "spiders" as const },
  { href: "/venomous-snakes", key: "venomous" as const },
  { href: "/snakes/shxamiani-gvelis-amocnoba", key: "identify" as const },
  { href: "/snakes/gvelis-nakbeni", key: "bite" as const },
  { href: "/snakes-in-the-yard", key: "yard" as const },
  { href: "/lizards/identifikacia", key: "lizardIdentify" as const },
  { href: "/amphibians/bayayi", key: "frogs" as const },
  { href: "/turtles/identifikacia", key: "turtleIdentify" as const },
  { href: "/regions", key: "regions" as const },
] as const;

export async function HomeSeo() {
  const t = await getTranslations("home.seo");

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.55rem,2.8vw,2.15rem)] leading-[1.15] font-semibold text-foreground">
          {t("title")}
        </h2>
        <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
        <nav aria-label={t("title")} className="mt-10">
          <ul className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2.5">
            {hubs.map((hub) => (
              <li key={hub.key}>
                <Link
                  className="text-[14px] text-foreground/80 underline decoration-border underline-offset-[5px] transition-colors hover:text-primary hover:decoration-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                  href={hub.href}
                >
                  {t(`links.${hub.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
