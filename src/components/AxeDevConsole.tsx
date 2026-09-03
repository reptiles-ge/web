"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  resetReportedKeys,
  startAxeScanner,
  stopAxeScanner,
} from "@/lib/axeDev";

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
