"use client";

import type { ComponentProps } from "react";

import NextLink from "next/link";

import { Link } from "@/i18n/baseNavigation";

export function NoPrefetchLink(
  props: Omit<ComponentProps<typeof Link>, "prefetch">,
) {
  return <Link {...props} prefetch={false} />;
}

export function NoPrefetchNextLink(
  props: Omit<ComponentProps<typeof NextLink>, "prefetch">,
) {
  return <NextLink {...props} prefetch={false} />;
}
