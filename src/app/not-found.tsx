import { NotFoundContent } from "@/components/NotFoundContent";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import {
  ThemeProvider,
  themeInitScript,
} from "@/components/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Noto_Sans_Georgian, Sora } from "next/font/google";
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

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${notoSansGeorgian.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <title>{`404 — ${siteConfig.name}`}</title>
      </head>
      <body className="min-h-full bg-background font-sans text-foreground transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <NotFoundContent />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
