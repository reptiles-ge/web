import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ReptiVerse — Discover Earth's Ancient Creatures",
  description:
    "A digital encyclopedia of reptiles and amphibians. Explore thousands of species through science, photography, and AI identification.",
  openGraph: {
    title: "ReptiVerse — Discover Earth's Ancient Creatures",
    description:
      "A digital encyclopedia of reptiles and amphibians. Explore thousands of species through science, photography, and AI identification.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReptiVerse — Discover Earth's Ancient Creatures",
    description:
      "A digital encyclopedia of reptiles and amphibians. Explore thousands of species through science, photography, and AI identification.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
