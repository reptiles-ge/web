import Script from "next/script";

export function TopGeCounter() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none opacity-0"
        data-site-id="118888"
        id="top-ge-counter-container"
        inert
      />
      <Script
        src={
          process.env.NODE_ENV === "production"
            ? "https://counter.top.ge/counter.js"
            : "/api/dev/top-ge?script"
        }
        strategy="afterInteractive"
      />
    </>
  );
}
