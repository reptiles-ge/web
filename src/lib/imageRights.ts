import type { GuideArticleImage } from "@/data/guideArticleTypes";
import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { photoLicenses } from "@/data/photoLicenses";
import {
  type ContributorDirectory,
  creditContributor,
  NO_CONTRIBUTORS,
} from "@/lib/contributorCredits";
import { creditAuthorPersonId, creditAuthorUrl } from "@/lib/creditAuthors";
import {
  absoluteUrl,
  localePath,
  ORGANIZATION_NAME,
  organizationRef,
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
    return photoRights(image.src, undefined, locale, NO_CONTRIBUTORS);
  return siteImageRights(locale);
}

export function photoContributor(
  credit: PhotoCredit | undefined,
  contributors: ContributorDirectory,
) {
  return creditContributor(contributors, credit);
}

export function photoRights(
  src: string,
  credit: PhotoCredit | undefined,
  locale: AppLocale,
  contributors: ContributorDirectory,
) {
  const creator = credit
    ? photoCreator(credit, locale, contributors)
    : undefined;
  if (creator && photoContributor(credit, contributors)) {
    return {
      acquireLicensePage: photoUsePageUrl(locale),
      copyrightHolder: organizationRef(),
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
    ...(!creator && !license
      ? { copyrightNotice: UNCREDITED_COPYRIGHT_NOTICE[locale] }
      : {}),
    ...(creator ? { creator, creditText: creator.name } : {}),
    license: license ?? photoUsePageUrl(locale),
  };
}

export function photoRightsCategory(
  src: string,
  credit: PhotoCredit | undefined,
  contributors: ContributorDirectory,
): PhotoRightsCategory {
  if (photoContributor(credit, contributors)) return "contributor";
  if (photoLicenses[src]?.license) return "open";
  return credit?.photographer?.trim() ? "permission" : "unknown";
}

export function photoUsePageUrl(locale: AppLocale) {
  return absoluteUrl(localePath(locale, "/photo-use"));
}

export function siteImageRights(locale: AppLocale) {
  const organization = organizationRef();
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
  contributors: ContributorDirectory,
): Creator | undefined {
  const photographer = credit.photographer?.trim();
  if (!photographer) return undefined;
  const author = photoContributor(credit, contributors);
  if (!author) {
    return {
      "@type": "Person",
      name: photographer,
      ...(credit.url ? { url: credit.url } : {}),
    };
  }
  const url = creditAuthorUrl(locale, author.id);
  const name = author.name;
  if (author.kind !== "person") {
    return { "@type": "Organization", name, url };
  }
  return {
    "@id": creditAuthorPersonId(locale, author.id),
    "@type": "Person",
    name,
    url,
  };
}
