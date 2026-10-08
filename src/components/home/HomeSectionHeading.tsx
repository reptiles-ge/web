import { cn } from "@/lib/cn";

export function HomeSectionHeading({
  eyebrow,
  subtitle,
  title,
}: {
  eyebrow: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        subtitle &&
          "grid gap-4 lg:grid-cols-[minmax(0,1fr)_500px] lg:items-end lg:gap-12",
      )}
    >
      <div>
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[30px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-4 lg:text-[44px] lg:leading-[1.1]">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="max-w-[500px] text-[15px] leading-[1.6] text-muted-foreground lg:pb-1.5 lg:text-[16px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
