import type { Metadata } from "next";

import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const metadata: Metadata = {
  robots: {
    follow: true,
    googleBot: { follow: true, index: false },
    index: false,
  },
};

export default function CatchAllPage() {
  notFound();
}
