"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const CLARITY_PROJECT_ID = "xxq0wlze2q";

declare global {
  interface Window {
    __reptilesClarityInit?: boolean;
  }
}

export function ClarityInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (window.__reptilesClarityInit) return;
    window.__reptilesClarityInit = true;
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
}
