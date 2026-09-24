import { getTranslations } from "next-intl/server";

import { NotFoundBoundary } from "@/components/NotFoundBoundary";
import { Link } from "@/i18n/navigation";

export async function NotFoundShell() {
  const t = await getTranslations("notFound");

  return (
    <div data-hide-footer data-not-found-shell>
      <div
        className="flex min-h-svh flex-col items-center justify-center gap-5 bg-ink px-6 text-center text-ink-foreground"
        data-not-found-fallback
      >
        <p className="font-display text-6xl font-semibold">404</p>
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <Link className="rounded-full bg-white px-6 py-3 text-ink" href="/">
          {t("home")}
        </Link>
      </div>
      <NotFoundBoundary />
    </div>
  );
}
