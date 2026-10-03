import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-kicker",
            "display-card",
            "display-title",
            "display-lead",
            "display-hero",
            "display-stat",
          ],
        },
      ],
      "text-wrap": [{ text: ["balance-tight"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
