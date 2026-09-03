import type { ElementType, ReactNode } from "react";

type RevealProps = {
  as?: "article" | "div" | "li" | "section";
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ as = "div", children, className }: RevealProps) {
  const Comp = as as ElementType;
  return <Comp className={className}>{children}</Comp>;
}
