import Script from "next/script";

export function TopGeCounter() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none opacity-0"
        data-site-id="118888"
        id="top-ge-counter-container"
      />
      <Script
        src="https://counter.top.ge/counter.js"
        strategy="afterInteractive"
      />
    </>
  );
}
