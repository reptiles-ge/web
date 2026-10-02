import { Noto_Sans } from "next/font/google";
import localFont from "next/font/local";

export const you = localFont({
  display: "swap",
  preload: true,
  src: [
    {
      path: "./fonts/You-Normal.woff2",
      weight: "400",
    },
    {
      path: "./fonts/You-Normal.woff2",
      weight: "500",
    },
    {
      path: "./fonts/You-Bold.woff2",
      weight: "600",
    },
    {
      path: "./fonts/You-Bold.woff2",
      weight: "700",
    },
  ],
  variable: "--font-you",
});

export const notoSans = Noto_Sans({
  display: "optional",
  preload: false,
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-noto-sans",
  weight: ["400", "500", "600", "700"],
});
