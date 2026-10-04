"use client";

import NextLink from "next/link";
import { type ComponentProps, useState } from "react";

import { Link } from "@/i18n/baseNavigation";

type IntentHandlers = Pick<
  ComponentProps<typeof NextLink>,
  "onFocus" | "onMouseEnter" | "onTouchStart" | "prefetch"
>;

export function IntentPrefetchLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} {...useIntentPrefetch(props)} />;
}

export function IntentPrefetchNextLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} {...useIntentPrefetch(props)} />;
}

function useIntentPrefetch({
  onFocus,
  onMouseEnter,
  onTouchStart,
  prefetch,
}: IntentHandlers): IntentHandlers {
  const [intent, setIntent] = useState(false);

  return {
    onFocus: (event) => {
      setIntent(true);
      onFocus?.(event);
    },
    onMouseEnter: (event) => {
      setIntent(true);
      onMouseEnter?.(event);
    },
    onTouchStart: (event) => {
      setIntent(true);
      onTouchStart?.(event);
    },
    prefetch: prefetch ?? (intent ? null : false),
  };
}
