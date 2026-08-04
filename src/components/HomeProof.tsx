import { getAtlasStats } from "@/data/speciesAtlas";
import { getTranslations } from "next-intl/server";

export async function HomeProof() {
  const t = await getTranslations("home.proof");
  const stats = getAtlasStats();

  const items = [
    { value: stats.total, label: t("species") },
    { value: stats.regions, label: t("regions") },
    { value: stats.venomous, label: t("venomous") },
    { value: stats.photos, label: t("photos") },
  ];

  return (
    <section
      aria-label={t("aria")}
      className="border-b border-border/70 bg-background"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-border/70 sm:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-background px-6 py-8 text-center sm:py-10 lg:px-10"
          >
            <p className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-none tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
