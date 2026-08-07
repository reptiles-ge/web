export type ChromeVariant = "light" | "dark";

export function chromeIconButtonClass(variant: ChromeVariant = "light") {
  return variant === "dark"
    ? "border-white/18 bg-white/10 text-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-white/35 hover:bg-white/14 hover:text-white"
    : "border-border/80 bg-card/90 text-muted-foreground shadow-[0_8px_28px_rgba(14,20,17,0.06)] backdrop-blur-xl hover:border-primary/35 hover:text-foreground hover:shadow-[0_10px_36px_rgba(47,107,79,0.12)]";
}

export function chromeShellClass(variant: ChromeVariant = "light") {
  return variant === "dark"
    ? "border-white/18 bg-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:border-white/35 hover:bg-white/14 focus-within:border-white/35 focus-within:bg-white/14"
    : "border-border/80 bg-card/90 text-foreground shadow-[0_8px_28px_rgba(14,20,17,0.06)] backdrop-blur-xl hover:border-primary/35 hover:shadow-[0_10px_36px_rgba(47,107,79,0.12)] focus-within:border-primary/35 focus-within:shadow-[0_10px_36px_rgba(47,107,79,0.12)]";
}

export const chromeIconButtonBase =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300";
