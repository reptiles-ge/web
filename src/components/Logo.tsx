import Image from "next/image";

import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  priority?: boolean;
  showWordmark?: boolean;
  size?: number;
  wordmarkClassName?: string;
};

export function Logo({
  className = "",
  priority = false,
  showWordmark = false,
  size = 40,
  wordmarkClassName = "",
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        alt="Reptiles"
        className="shrink-0 object-contain"
        fetchPriority="auto"
        height={size}
        loading={priority ? "eager" : "lazy"}
        sizes={`${Math.round(size * 2)}px`}
        src="https://cdn.reptiles.ge/logo.webp"
        width={size}
      />
      {showWordmark ? (
        <span
          className={cn(
            "font-display font-semibold tracking-tight",
            wordmarkClassName,
          )}
        >
          Reptiles
        </span>
      ) : null}
    </span>
  );
}
