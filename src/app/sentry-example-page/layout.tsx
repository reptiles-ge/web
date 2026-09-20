import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  description: "Test Sentry for your Next.js app.",
  robots: {
    follow: false,
    index: false,
  },
  title: "sentry-example-page",
};

type Props = {
  children: ReactNode;
};

export default function SentryExampleLayout({ children }: Props) {
  return children;
}
