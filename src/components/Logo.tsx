import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
  showWordmark?: boolean;
  wordmarkClassName?: string;
};

export function Logo({
  className = "",
  size = 40,
  priority = false,
  showWordmark = false,
  wordmarkClassName = "",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="https://cdn.reptiles.ge/logo.webp"
        alt="Reptiles"
        width={size}
        height={size}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="shrink-0 object-contain"
        sizes={`${Math.round(size * 2)}px`}
      />
      {showWordmark ? (
        <span
          className={`font-display font-semibold tracking-tight ${wordmarkClassName}`}
        >
          Reptiles
        </span>
      ) : null}
    </span>
  );
}
