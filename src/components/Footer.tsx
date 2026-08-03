import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";

const columns = [
  {
    title: "აღმოჩენა",
    links: ["სახეობები", "ატლასი", "კოლექციები", "საველე ჩანაწერები"],
  },
  {
    title: "მეცნიერება",
    links: [
      "მეთოდოლოგია",
      "კონტრიბუტორები",
      "მონაცემთა წყაროები",
      "კონსერვაცია",
    ],
  },
  {
    title: "კომპანია",
    links: ["შესახებ", "პრესა", "კონტაქტი", "კონფიდენციალობა"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="inline-flex transition-opacity hover:opacity-90">
              <Logo size={56} showWordmark wordmarkClassName="text-[20px]" />
            </a>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია.
            </p>
            <div className="mt-7">
              <LanguageSwitcher />
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] tracking-[0.22em] text-muted-foreground">
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
          <span>
            © {new Date().getFullYear()} Reptiles. ყველა უფლება დაცულია.
          </span>
          <span className="tracking-wide">ცნობისმოყვარეებისთვის.</span>
        </div>
      </div>
    </footer>
  );
}
