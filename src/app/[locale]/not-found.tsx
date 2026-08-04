import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex min-h-[70svh] items-center bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-24 lg:px-10">
        <p className="text-[12px] tracking-[0.22em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 max-w-xl font-display text-balance-tight text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] text-foreground">
          {t("title")}
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          {t("body")}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background transition-opacity hover:opacity-90"
          >
            {t("home")}
          </Link>
          <Link
            href="/species"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-[14px] font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t("species")}
          </Link>
        </div>
      </div>
    </main>
  );
}
