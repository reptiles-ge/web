"use client";

import { type ComponentProps, useState } from "react";

import { Link } from "@/i18n/navigation";

type IntentPrefetchLinkProps = Omit<ComponentProps<typeof Link>, "prefetch">;

export function IntentPrefetchLink({
  onFocus,
  onMouseEnter,
  onTouchStart,
  ...props
}: IntentPrefetchLinkProps) {
  const [intent, setIntent] = useState(false);

  return (
    <Link
      {...props}
      onFocus={(event) => {
        setIntent(true);
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        setIntent(true);
        onMouseEnter?.(event);
      }}
      onTouchStart={(event) => {
        setIntent(true);
        onTouchStart?.(event);
      }}
      prefetch={intent ? null : false}
    />
  );
}
