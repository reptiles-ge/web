export function HomeSectionHeading({
  eyebrow,
  subtitle,
  title,
}: {
  eyebrow: string;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="max-w-xl">
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 className="text-balance-tight mt-4 font-display text-display-title font-semibold">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
