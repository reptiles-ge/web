import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamicParams = true;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function CatchAllPage() {
  notFound();
}
