import Script from "next/script";

export function TopGeCounter() {
  return (
    <>
      <div id="top-ge-counter-container" data-site-id="118888" />
      <Script src="https://counter.top.ge/counter.js" strategy="afterInteractive" />
    </>
  );
}
