import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  absoluteUrl,
  openGraphJpeg,
  SITE_OG_IMAGE_URL,
  siteConfig,
} from "@/lib/site";

import "./globals.css";

const FACEBOOK_APP_ID = "1033733009490487";

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  authors: [
    {
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  ],
  category: "science",
  creator: siteConfig.name,
  description: siteConfig.description,
  facebook: {
    appId: FACEBOOK_APP_ID,
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  metadataBase: new URL(absoluteUrl("/")),
  openGraph: {
    description: siteConfig.description,
    images: [openGraphJpeg(SITE_OG_IMAGE_URL, siteConfig.title)],
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    type: "website",
    url: absoluteUrl("/"),
  },
  publisher: siteConfig.name,
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  twitter: {
    card: "summary_large_image",
    description: siteConfig.description,
    images: [SITE_OG_IMAGE_URL],
    title: siteConfig.title,
  },
  verification: {
    yandex: "2dc599344cbb9c66",
  },
};

export default function RootLayout({ children }: Props) {
  return children;
}
