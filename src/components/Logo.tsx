import { cn } from "@/lib/cn";

export const LOGO_SRC = "/images/logo-160.webp";
export const LOGO_AVIF_SRCSET =
  "/images/logo-88.avif 88w, /images/logo-160.avif 160w";
export const LOGO_WEBP_SRCSET =
  "/images/logo-88.webp 88w, /images/logo-160.webp 160w";
export const LOGO_NAV_SIZE = 44;

type LogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  showWordmark?: boolean;
  size?: number;
  wordmarkClassName?: string;
};

export function Logo({
  alt,
  className = "",
  priority = false,
  showWordmark = false,
  size = 40,
  wordmarkClassName = "",
}: LogoProps) {
  const sizes = `${size}px`;
  const resolvedAlt = alt ?? (showWordmark ? "" : "Reptiles");

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <picture>
        <source sizes={sizes} srcSet={LOGO_AVIF_SRCSET} type="image/avif" />
        <source sizes={sizes} srcSet={LOGO_WEBP_SRCSET} type="image/webp" />
        <img
          alt={resolvedAlt}
          className="shrink-0 object-contain"
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          height={size}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          src={LOGO_SRC}
          width={size}
        />
      </picture>
      {showWordmark ? (
        <span
          className={cn(
            "font-[system-ui,sans-serif] font-semibold tracking-tight",
            wordmarkClassName,
          )}
        >
          Reptiles
        </span>
      ) : null}
    </span>
  );
}
