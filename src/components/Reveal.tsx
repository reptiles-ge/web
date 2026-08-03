import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className }: RevealProps) {
  if (className) {
    return <div className={className}>{children}</div>;
  }

  return <>{children}</>;
}
