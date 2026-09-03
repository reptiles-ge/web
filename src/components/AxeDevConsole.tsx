"use client";

import { usePathname } from "next/navigation";
import {
  resetReportedKeys,
  startAxeScanner,
  stopAxeScanner,
} from "@/lib/axeDev";
import { useEffect } from "react";

export function AxeDevConsole() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    void startAxeScanner();
    return () => stopAxeScanner();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    resetReportedKeys();
  }, [pathname]);

  return null;
}
