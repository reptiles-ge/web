import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "section";
};

export function Reveal({
  children,
  className,
  as = "div",
}: RevealProps) {
  const Comp = as as ElementType;
  return <Comp className={className}>{children}</Comp>;
}
