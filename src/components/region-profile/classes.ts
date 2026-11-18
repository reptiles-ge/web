import { h2Class } from "@/components/regions-index/shared";
import { cn } from "@/lib/cn";

export const regionH2Class = cn(
  h2Class,
  "scroll-mt-40 lg:text-[40px] lg:tracking-[-0.018em]",
);

export const scrollerClass =
  "-mx-6 flex snap-x snap-mandatory scroll-px-6 scrollbar-none gap-2 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden";

export const arrowLinkClass =
  "inline-flex items-center gap-2 text-[14px] font-semibold text-(--nw-ink)";
