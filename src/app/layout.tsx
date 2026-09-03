import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  CDN_BASE,
  SITE_OG_IMAGE_URL,
  openGraphJpeg,
  siteConfig,
} from "@/lib/site";
import { GoogleTagManager } from "@next/third-parties/google";
import { Noto_Sans, Noto_Sans_Georgian, Sora } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { preconnect, preload } from "react-dom";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const GTM_ID = "GTM-NM65ZMML";
const FACEBOOK_APP_ID = "1033733009490487";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  display: "optional",
  preload: false,
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian", "latin"],
  display: "optional",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "optional",
  preload: false,
});

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [
    {
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "science",
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [openGraphJpeg(SITE_OG_IMAGE_URL, siteConfig.title)],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [SITE_OG_IMAGE_URL],
  },
  facebook: {
    appId: FACEBOOK_APP_ID,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
      lang={locale}
      className={`${sora.variable} ${notoSansGeorgian.variable} ${notoSans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      {isProd ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <head>
        {isProd ? null : (
          <Script
            src="//unpkg.com/react-scan/dist/auto.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground transition-colors duration-300">
        {isProd ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              title="Google Tag Manager"
              sandbox="allow-scripts"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <NuqsAdapter>
          <ThemeProvider>{children}</ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
