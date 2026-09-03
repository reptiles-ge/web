import type { ReactNode } from "react";

import { Link as LinkIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slugify";

type AnchoredHeadingProps = {
  anchorLabel: string;
  as?: "h2" | "h3";
  children: ReactNode;
  className?: string;
  id?: string;
  showAnchor?: boolean;
  slugSource?: string;
};

export function AnchoredHeading({
  anchorLabel,
  as: Tag = "h2",
  children,
  className,
  id,
  showAnchor = true,
  slugSource,
}: AnchoredHeadingProps) {
  const headingId = id ?? slugify(slugSource ?? textFromChildren(children));

  if (!headingId) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={cn("group/heading scroll-mt-28", className)} id={headingId}>
      <span className="inline">{children}</span>
      {showAnchor ? (
        <a
          aria-label={anchorLabel}
          className="ml-2 inline-flex translate-y-[-0.05em] items-center text-muted-foreground/0 transition-colors group-hover/heading:text-muted-foreground/70 focus-visible:text-primary focus-visible:outline-none"
          href={`#${headingId}`}
        >
          <LinkIcon
            aria-hidden="true"
            className="size-[0.55em]"
            strokeWidth={2}
          />
        </a>
      ) : null}
    </Tag>
  );
}

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }
  return "";
}
