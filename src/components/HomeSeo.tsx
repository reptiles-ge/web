import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

const hubs = [
  { key: "species" as const, href: "/species" },
  { key: "snakes" as const, href: "/snakes" },
  { key: "lizards" as const, href: "/lizards" },
  { key: "turtles" as const, href: "/turtles" },
  { key: "amphibians" as const, href: "/amphibians" },
  { key: "venomous" as const, href: "/venomous-snakes" },
  { key: "identify" as const, href: "/snakes/shxamiani-gvelis-amocnoba" },
  { key: "bite" as const, href: "/snakes/gvelis-nakbeni" },
  { key: "yard" as const, href: "/snakes-in-the-yard" },
  { key: "lizardIdentify" as const, href: "/lizards/identifikacia" },
  { key: "frogs" as const, href: "/amphibians/bayayi" },
  { key: "turtleIdentify" as const, href: "/turtles/identifikacia" },
  { key: "regions" as const, href: "/regions" },
] as const;

export async function HomeSeo() {
  const t = await getTranslations("home.seo");

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight text-foreground">
          {t("title")}
        </h2>
        <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
        <ul className="mt-8 max-w-3xl space-y-2 border-l-2 border-primary/25 pl-4">
          {hubs.map((hub) => (
            <li key={hub.key}>
              <Link
                href={hub.href}
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-primary"
              >
                {t(`links.${hub.key}`)}
                <ArrowUpRight className="size-3.5 opacity-50" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
