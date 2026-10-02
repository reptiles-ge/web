import type { ReactNode } from "react";

import dynamic from "next/dynamic";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { preconnect } from "react-dom";

import { GoogleTagManager } from "@/components/GoogleTagManager";
import { themeInitScript, ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/cn";
import { CDN_BASE } from "@/lib/site";

import { notoSans, you } from "./fonts";

const GTM_ID = "GTM-NM65ZMML";

const AxeDevConsole =
  process.env.NODE_ENV === "production"
    ? () => null
    : dynamic(() =>
        import("@/components/AxeDevConsole").then((mod) => mod.AxeDevConsole),
      );

type Props = {
  children: ReactNode;
  locale: string;
};

export function RootDocument({ children, locale }: Props) {
  const isProd = process.env.NODE_ENV === "production";

  preconnect(CDN_BASE);

  return (
    <html
      className={cn(you.variable, notoSans.variable, "h-full antialiased")}
      data-scroll-behavior="smooth"
      lang={locale}
      suppressHydrationWarning
    >
      {isProd ? <GoogleTagManager gtmId={GTM_ID} /> : null}
      <head>
        {isProd ? null : (
          <Script
            crossOrigin="anonymous"
            src="https://unpkg.com/react-scan/dist/auto.global.js"
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
