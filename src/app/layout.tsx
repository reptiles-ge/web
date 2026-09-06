import type { Metadata } from "next";
import type { ReactNode } from "react";

import { GoogleTagManager } from "@next/third-parties/google";
import { getLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Noto_Sans, Noto_Sans_Georgian, Sora } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { preconnect, preload } from "react-dom";

import { themeInitScript, ThemeProvider } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import {
  absoluteUrl,
  CDN_BASE,
  openGraphJpeg,
  SITE_OG_IMAGE_URL,
  siteConfig,
} from "@/lib/site";

import "./globals.css";

const GTM_ID = "GTM-NM65ZMML";
const FACEBOOK_APP_ID = "1033733009490487";

const sora = Sora({
  display: "swap",
  preload: false,
  subsets: ["latin", "latin-ext"],
  variable: "--font-sora",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  display: "swap",
  subsets: ["georgian", "latin"],
  variable: "--font-noto-georgian",
});

const notoSans = Noto_Sans({
  display: "swap",
  preload: false,
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: ReactNode;
};

const AxeDevConsole =
  process.env.NODE_ENV === "production"
    ? () => null
    : dynamic(() =>
        import("@/components/AxeDevConsole").then((mod) => mod.AxeDevConsole),
      );

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
};

export default async function RootLayout({ children }: Props) {
  const locale = await getLocale().catch(() => routing.defaultLocale);
  const isProd = process.env.NODE_ENV === "production";

  preconnect(CDN_BASE);
  preload("/images/image-placeholder.svg", {
    as: "image",
    fetchPriority: "high",
  });
  preload("/images/image-placeholder-dark.svg", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <html
      className={cn(
        sora.variable,
        notoSansGeorgian.variable,
        notoSans.variable,
        "h-full antialiased",
      )}
      data-scroll-behavior="smooth"
      lang={locale}
      suppressHydrationWarning
    >
      {isProd ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <head>
        {isProd ? null : (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            strategy="beforeInteractive"
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground transition-colors duration-300">
        {isProd ? (
          <noscript>
            <iframe
              height="0"
              sandbox="allow-scripts"
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        ) : null}
        <NuqsAdapter>
          <ThemeProvider>
            {children}
            <AxeDevConsole />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
