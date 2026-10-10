import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { CreditAuthor } from "@/data/creditAuthors";
import type { NewsArticle } from "@/data/news";
import type { AppLocale } from "@/i18n/routing";
import type { CreditAuthorPhoto } from "@/lib/creditAuthors";

import { AuthorGallery } from "@/components/AuthorGallery";
import {
  AuthorIdentity,
  AuthorNext,
  type AuthorSocial,
  AuthorSpeciesGroups,
  AuthorSummary,
} from "@/components/AuthorPageParts";
import { NewsArticleCard } from "@/components/NewsArticleCard";
import { FacebookGlyph, InstagramGlyph } from "@/components/SocialGlyphs";
import {
  creditAuthorBio,
  creditAuthorIndexHref,
  creditAuthorName,
} from "@/data/creditAuthors";
import { Link } from "@/i18n/navigation";
import {
  getCreditAuthorFieldSummary,
  getCreditAuthorGroupStats,
  getCreditAuthorSpeciesIds,
} from "@/lib/creditAuthors";

const EYEBROW =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";

export async function AuthorPage({
  author,
  locale,
  photos,
  relatedNews,
}: {
  author: CreditAuthor;
  locale: AppLocale;
  photos: CreditAuthorPhoto[];
  relatedNews: NewsArticle[];
}) {
  const [t, tProfile] = await Promise.all([
    getTranslations({ locale, namespace: "author" }),
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const name = creditAuthorName(author, locale);
  const bio = creditAuthorBio(author, locale);
  const speciesIds = getCreditAuthorSpeciesIds(photos);
  const groups = getCreditAuthorGroupStats(photos);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-12 sm:pt-28 lg:pt-32 lg:pb-[72px]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
          <nav
            aria-label={tProfile("breadcrumbAria")}
            className="flex items-center gap-3"
          >
            <Link
              className="inline-flex h-9 items-center gap-1 rounded-full bg-card pr-[15px] pl-[9px] text-[13.5px] font-medium text-foreground transition-colors hover:text-primary"
              href={creditAuthorIndexHref()}
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("index.breadcrumb")}
            </Link>
            <span
              aria-current="page"
              className="truncate text-[13px] text-muted-foreground"
            >
              {name}
            </span>
          </nav>

          <div className="mt-7 lg:mt-10 lg:flex lg:items-start lg:gap-12">
            <AuthorIdentity
              author={author}
              bio={bio}
              locale={locale}
              name={name}
              photos={photos.length}
              socials={authorSocials(author, t)}
            />
            <AuthorSummary
              field={getCreditAuthorFieldSummary(photos)}
              groups={groups}
              locale={locale}
              photos={photos.length}
              species={speciesIds.length}
            />
          </div>
        </div>
      </section>

      {photos.length > 0 ? (
        <section className="scroll-mt-28 bg-card py-12 lg:py-20" id="gallery">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
            <AuthorGallery locale={locale} photos={photos} />
          </div>
        </section>
      ) : null}

      <AuthorSpeciesGroups
        groups={groups}
        locale={locale}
        species={speciesIds.length}
      />

      {relatedNews.length > 0 ? (
        <section className="pb-12 lg:pb-[88px]">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
            <div className="max-w-3xl">
              <p className={EYEBROW}>{t("relatedNews")}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {t("relatedNewsIntro", { name })}
              </p>
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {relatedNews.map((article) => (
                <li className="h-full" key={article.id}>
                  <NewsArticleCard article={article} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <AuthorNext hubs={groups.map((group) => group.hub)} locale={locale} />
    </div>
  );
}

function authorSocials(
  author: CreditAuthor,
  t: Awaited<ReturnType<typeof getTranslations>>,
): AuthorSocial[] {
  const socials: AuthorSocial[] = [];
  if (author.links?.facebook) {
    socials.push({
      href: author.links.facebook,
      Icon: FacebookGlyph,
      key: "facebook",
      label: t("facebook"),
    });
  }
  if (author.links?.instagram) {
    socials.push({
      href: author.links.instagram,
      Icon: InstagramGlyph,
      key: "instagram",
      label: t("instagram"),
    });
  }
  if (author.links?.researchGate) {
    socials.push({
      href: author.links.researchGate,
      Icon: ExternalLink,
      key: "researchGate",
      label: "ResearchGate",
    });
  }
  return socials;
}
