import type { ReactNode } from "react";

export const codeClass =
  "m-0 overflow-x-auto font-mono text-[13px] leading-[1.7] whitespace-pre text-[#e9eee6]";

export function JsonKey({ children }: { children: ReactNode }) {
  return <span className="text-[#7fc29b]">{children}</span>;
}

export function JsonString({ children }: { children: ReactNode }) {
  return <span className="text-[#e8c98a]">{children}</span>;
}

export function Keyword({ children }: { children: ReactNode }) {
  return <span className="text-[#9ec5f0]">{children}</span>;
}
