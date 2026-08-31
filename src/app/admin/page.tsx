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
        ატვირთვა წერს CDN-ს და MDX gallery-ს. საჯარო გვერდი არ იცვლება, სანამ PR
        არ გაიმერჯება.
      </p>
      <div className="mt-8">
        <AdminSpeciesList species={species} />
      </div>
    </main>
  );
}
