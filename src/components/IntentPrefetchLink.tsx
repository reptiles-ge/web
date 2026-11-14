"use client";

import NextLink from "next/link";
import { type ComponentProps, useState } from "react";

import { Link } from "@/i18n/baseNavigation";

type IntentHandlers = Pick<
  ComponentProps<typeof NextLink>,
  "onFocus" | "onMouseEnter" | "onTouchStart" | "prefetch"
>;

export function HoverPrefetchLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} {...useIntentPrefetch(props, "hover")} />;
}

export function IntentPrefetchLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} {...useIntentPrefetch(props, "intent")} />;
}

export function IntentPrefetchNextLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} {...useIntentPrefetch(props, "intent")} />;
}

function useIntentPrefetch(
  { onFocus, onMouseEnter, onTouchStart, prefetch }: IntentHandlers,
  mode: "hover" | "intent",
): IntentHandlers {
  const onTouch = mode === "intent";
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
    onTouchStart: onTouch
      ? (event) => {
          setIntent(true);
          onTouchStart?.(event);
        }
      : onTouchStart,
    prefetch: prefetch ?? (intent ? (mode === "hover" ? true : null) : false),
  };
}
