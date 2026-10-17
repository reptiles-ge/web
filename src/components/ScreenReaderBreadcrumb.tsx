import { Link } from "@/i18n/navigation";

export function ScreenReaderBreadcrumb({
  current,
  home,
  label,
}: {
  current: string;
  home: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="sr-only">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
        <li>
          <Link className="transition-colors hover:text-foreground" href="/">
            {home}
          </Link>
        </li>
        <li aria-hidden="true" className="text-border">
          /
        </li>
        <li className="text-foreground">{current}</li>
      </ol>
    </nav>
  );
}
