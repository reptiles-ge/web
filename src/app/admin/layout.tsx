import { assertLocalAdminPage } from "@/lib/adminAccess";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  assertLocalAdminPage();
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="font-display text-[15px] font-medium">
            Admin
          </Link>
          <p className="text-[12px] text-muted-foreground">
            localhost · MDX · PR
          </p>
        </div>
      </header>
      {children}
    </div>
  );
}
