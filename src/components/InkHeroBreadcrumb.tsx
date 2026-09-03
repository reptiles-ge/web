"use client";

import { ArrowLeft } from "lucide-react";
import { Fragment } from "react";

import { Link } from "@/i18n/navigation";

type InkHeroCrumb = {
  href?: Parameters<typeof Link>[0]["href"];
  label: string;
  withBack?: boolean;
};

export function InkHeroBreadcrumb({ crumbs }: { crumbs: InkHeroCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 sm:mb-7">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-white/55">
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 ? (
              <li aria-hidden="true" className="text-white/30">
                /
              </li>
            ) : null}
            <li className={crumb.href ? undefined : "text-white/80"}>
              {crumb.href ? (
                <Link
                  className={
                    crumb.withBack
                      ? "inline-flex items-center gap-2 transition-colors hover:text-white"
                      : "transition-colors hover:text-white"
                  }
                  href={crumb.href}
                >
                  {crumb.withBack ? <ArrowLeft className="size-3.5" /> : null}
                  {crumb.label}
                </Link>
              ) : (
                crumb.label
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
