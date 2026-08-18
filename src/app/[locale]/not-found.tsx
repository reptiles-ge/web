import { NotFoundContent } from "@/components/NotFoundContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
