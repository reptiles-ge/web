"use client";

import Script from "next/script";

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  return (
    <>
      <Script
        dangerouslySetInnerHTML={{
          __html: `(function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});})(window,'dataLayer');`,
        }}
        id="_next-gtm-init"
        strategy="afterInteractive"
      />
      <Script
        id="_next-gtm"
        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
        strategy="lazyOnload"
      />
    </>
  );
}
