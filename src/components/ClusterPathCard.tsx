"use client";

import { ArrowUpRight } from "lucide-react";
import { type ComponentProps } from "react";

import { Link } from "@/i18n/navigation";

type ClusterPathCardProps = {
  body: string;
  cta: string;
  eyebrow: string;
  href: ComponentProps<typeof Link>["href"];
  title: string;
};

export function ClusterPathCard({
  body,
  cta,
  eyebrow,
  href,
  title,
}: ClusterPathCardProps) {
  return (
    <Link
      className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background sm:p-9"
      href={href}
    >
      <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
      <div className="mt-6">
        <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
          {title}
        </p>
        <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">{body}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
          {cta}
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
