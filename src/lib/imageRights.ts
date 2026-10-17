import type { GuideArticleImage } from "@/data/guideArticleTypes";
import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import {
  creditAuthorKind,
  creditAuthorName,
  getPublishedCreditAuthorByName,
} from "@/data/creditAuthors";
import { photoLicenses } from "@/data/photoLicenses";
import { creditAuthorPersonId, creditAuthorUrl } from "@/lib/creditAuthors";
import {
  absoluteUrl,
  localePath,
  ORGANIZATION_NAME,
  siteEntityId,
} from "@/lib/site";

const PUBLIC_DOMAIN_PREFIX = "https://creativecommons.org/publicdomain/";

const UNCREDITED_COPYRIGHT_NOTICE: Record<AppLocale, string> = {
  en: "© The photo's author. All rights reserved.",
  ka: "© ფოტოს ავტორი. ყველა უფლება დაცულია.",
  ru: "© Автор фотографии. Все права защищены.",
  tr: "© Fotoğrafın sahibi. Tüm hakları saklıdır.",
};

export type PhotoRightsCategory =
  "contributor" | "open" | "permission" | "unknown";

type Creator = {
  "@id"?: string;
  "@type": "Organization" | "Person";
  name: string;
  url?: string;
};

export function guideImageRights(image: GuideArticleImage, locale: AppLocale) {
  if (image.credit) {
    const licensed = Boolean(image.license && image.creditUrl);
    return {
      acquireLicensePage: licensed
        ? (image.creditUrl as string)
        : photoUsePageUrl(locale),
      creditText: image.credit[locale],
      license: licensed
        ? (image.license as { url: string }).url
        : photoUsePageUrl(locale),
    };
  }
  if (image.src.includes("/external/"))
    return photoRights(image.src, undefined, locale);
  return siteImageRights(locale);
}

export function photoContributor(credit: PhotoCredit | undefined) {
  const photographer = credit?.photographer?.trim();
  return photographer
    ? getPublishedCreditAuthorByName(photographer)
    : undefined;
}

export function photoRights(
  src: string,
  credit: PhotoCredit | undefined,
  locale: AppLocale,
) {
  const creator = credit ? photoCreator(credit, locale) : undefined;
  if (creator && photoContributor(credit)) {
    return {
      acquireLicensePage: photoUsePageUrl(locale),
      copyrightHolder: siteOrganization(),
      copyrightNotice: `© ${ORGANIZATION_NAME}`,
      creator,
      creditText: creator.name,
      license: photoUsePageUrl(locale),
    };
  }
  const record = photoLicenses[src];
  const license = record?.license ?? undefined;
  const publicDomain = Boolean(license?.startsWith(PUBLIC_DOMAIN_PREFIX));
  return {
    acquireLicensePage: license ? record.sourceUrl : photoUsePageUrl(locale),
    ...(creator && !publicDomain
      ? {
          copyrightHolder: creator,
          copyrightNotice: `© ${creator.name}`,
        }
      : {}),
    ...(!creator && !publicDomain
      ? { copyrightNotice: UNCREDITED_COPYRIGHT_NOTICE[locale] }
      : {}),
    ...(creator ? { creator, creditText: creator.name } : {}),
    license: license ?? photoUsePageUrl(locale),
  };
}

export function photoRightsCategory(
  src: string,
  credit: PhotoCredit | undefined,
): PhotoRightsCategory {
  if (photoContributor(credit)) return "contributor";
  if (photoLicenses[src]?.license) return "open";
  return credit?.photographer?.trim() ? "permission" : "unknown";
}

export function photoUsePageUrl(locale: AppLocale) {
  return absoluteUrl(localePath(locale, "/photo-use"));
}

export function siteImageRights(locale: AppLocale) {
  const organization = siteOrganization();
  return {
    acquireLicensePage: photoUsePageUrl(locale),
    copyrightHolder: organization,
    copyrightNotice: `© ${ORGANIZATION_NAME}`,
    creator: organization,
    creditText: ORGANIZATION_NAME,
    license: photoUsePageUrl(locale),
  };
}

function photoCreator(
  credit: PhotoCredit,
  locale: AppLocale,
): Creator | undefined {
  const photographer = credit.photographer?.trim();
  if (!photographer) return undefined;
  const author = photoContributor(credit);
  if (!author) {
    return {
      "@type": "Person",
      name: photographer,
      ...(credit.url ? { url: credit.url } : {}),
    };
  }
  const url = creditAuthorUrl(locale, author.slug);
  const name = creditAuthorName(author, locale);
  if (creditAuthorKind(author) !== "person") {
    return { "@type": "Organization", name, url };
  }
  return {
    "@id": creditAuthorPersonId(locale, author.slug),
    "@type": "Person",
    name,
    url,
  };
}

function siteOrganization(): Creator {
  return {
    "@id": siteEntityId("organization"),
    "@type": "Organization",
    name: ORGANIZATION_NAME,
  };
}
