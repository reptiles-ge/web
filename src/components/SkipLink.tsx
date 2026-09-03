export function SkipLink({ label }: { label: string }) {
  return (
    <a
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      href="#main"
    >
      {label}
    </a>
  );
}
