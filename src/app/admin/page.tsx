import Link from "next/link";

import { AdminSpeciesList } from "@/components/admin/AdminSpeciesList";
import { assertLocalAdminPage } from "@/lib/adminAccess";
import { listAdminSpecies } from "@/lib/adminGalleryMdx";

export const dynamic = "force-dynamic";

export default function AdminIndexPage() {
  assertLocalAdminPage();
  const species = listAdminSpecies();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        სახეობები
      </h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
        ატვირთვა წერს CDN-ს და ხსნის PR-ს. ლოკალური ბრენჩი არ იცვლება.
        reptiles.ge იცვლება მხოლოდ merge-ის შემდეგ.
      </p>
      <Link
        className="mt-6 inline-flex rounded-lg border border-border bg-card px-4 py-3 text-[14px] font-medium hover:bg-secondary"
        href="/admin/cdn-upload"
      >
        ცალკე ფოტოების CDN-ზე ატვირთვა →
      </Link>
      <div className="mt-8">
        <AdminSpeciesList species={species} />
      </div>
    </main>
  );
}
