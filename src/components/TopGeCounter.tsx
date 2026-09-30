"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

const SITE_ID = "118888";

export function TopGeCounter() {
  const pathname = usePathname();
  const referrer = useRef("");
  const landed = useRef(false);

  useEffect(() => {
    const previous = referrer.current;
    referrer.current = location.href;
    if (!landed.current) {
      landed.current = true;
      return;
    }
    const img = document.querySelector("#top-ge-counter-container img");
    if (img instanceof HTMLImageElement && hitHref(img.src) === location.href) {
      return;
    }
    sendTopGeHit(previous);
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none opacity-0"
        data-site-id={SITE_ID}
        id="top-ge-counter-container"
        inert
      />
      <Script
        src="https://counter.top.ge/counter.js"
        strategy="afterInteractive"
      />
    </>
  );
}

function hitHref(src: string) {
  const encoded = src.match(/(?:^|[+?])JL:([^+]*)/)?.[1];
  return encoded ? decodeURIComponent(encoded) : "";
}

function sendTopGeHit(referrer: string) {
  const src =
    "https://counter.top.ge/cgi-bin/count222?" +
    [
      ["ID", SITE_ID],
      ["JS", "11"],
      ["RAND", String(10_000 * Math.random())],
      ["ISFRM", window.self === window.top ? "0" : "1"],
      ["REFERER", referrer.slice(0, 1000)],
      ["RESOLUTION", `${screen.width}x${screen.height}`],
      ["JL", location.href.slice(0, 1000)],
      ["DEPT", String(screen.colorDepth || screen.pixelDepth)],
    ]
      .map(([key, value]) => `${key}:${encodeURIComponent(value)}`)
      .join("+");
  const img = document.querySelector("#top-ge-counter-container img");
  if (img instanceof HTMLImageElement) {
    img.src = src;
    return;
  }
  new Image().src = src;
}
