import { cn } from "@/lib/cn";
import { slugify } from "@/lib/slugify";
import { Link as LinkIcon } from "lucide-react";
import type { ReactNode } from "react";

type AnchoredHeadingProps = {
  as?: "h2" | "h3";
  id?: string;
  slugSource?: string;
  children: ReactNode;
  className?: string;
  anchorLabel: string;
  showAnchor?: boolean;
};

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }
  return "";
}

export function AnchoredHeading({
  as: Tag = "h2",
  id,
  slugSource,
  children,
  className,
  anchorLabel,
  showAnchor = true,
}: AnchoredHeadingProps) {
  const headingId = id ?? slugify(slugSource ?? textFromChildren(children));

  if (!headingId) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag id={headingId} className={cn("group/heading scroll-mt-28", className)}>
      <span className="inline">{children}</span>
      {showAnchor ? (
        <a
          href={`#${headingId}`}
          className="ml-2 inline-flex translate-y-[-0.05em] items-center text-muted-foreground/0 transition-colors group-hover/heading:text-muted-foreground/70 focus-visible:text-primary focus-visible:outline-none"
          aria-label={anchorLabel}
        >
          <LinkIcon
            className="size-[0.55em]"
            strokeWidth={2}
            aria-hidden="true"
          />
        </a>
      ) : null}
    </Tag>
  );
}
