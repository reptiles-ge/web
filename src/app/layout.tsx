import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import { absoluteUrl, CDN_BASE, siteConfig } from "@/lib/site";
import { Noto_Sans_Georgian, Sora } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
    images: [
      {
        url: "https://cdn.reptiles.ge/og-landing.jpg",
        width: 1024,
        height: 541,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["https://cdn.reptiles.ge/og-landing.jpg"],
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

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${notoSansGeorgian.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href={CDN_BASE} />
        <link rel="dns-prefetch" href={CDN_BASE} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
