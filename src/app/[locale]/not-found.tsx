import type { Metadata } from "next";

import { NotFoundContent } from "@/components/NotFoundContent";

export const metadata: Metadata = {
  robots: {
    follow: true,
    googleBot: { follow: true, index: false },
    index: false,
  },
};

export default function NotFound() {
  return <NotFoundContent />;
}
