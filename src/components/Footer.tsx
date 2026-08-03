import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const columns = [
  {
    title: "Explore",
    links: ["Species", "Atlas", "Collections", "Field notes"],
  },
  {
    title: "Science",
    links: ["Methodology", "Contributors", "Data sources", "Conservation"],
  },
  {
    title: "Company",
    links: ["About", "Press", "Contact", "Privacy"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-[20px] font-semibold tracking-tight">
              Repti<span className="text-primary">Verse</span>
            </p>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              A digital encyclopedia of reptiles and amphibians.
            </p>
            <div className="mt-7">
              <LanguageSwitcher />
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ReptiVerse. All rights reserved.</span>
          <span className="tracking-wide">Made for the curious.</span>
        </div>
      </div>
    </footer>
  );
}
