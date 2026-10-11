/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import type { ReactNode } from "react";

import { useEffect, useState } from "react";

import { usePathname } from "@/i18n/navigation";

export function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(() => shouldHideFooter(pathname));

  useEffect(() => {
    if (shouldHideFooter(pathname)) {
      setHidden(true);
      return;
    }
    setHidden(Boolean(document.querySelector("[data-hide-footer]")));
  }, [pathname]);

  if (hidden) {
    return null;
  }

  return children;
}

function shouldHideFooter(pathname: string) {
  return pathname === "/contact" || pathname.startsWith("/quiz/");
}
