import { AdminSpeciesEditor } from "@/components/admin/AdminSpeciesEditor";
import { assertLocalAdminPage } from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminSpeciesPage({ params }: Props) {
  assertLocalAdminPage();
  const { id } = await params;
  if (!isSpeciesContentId(id)) notFound();

  let species: ReturnType<typeof readAdminSpeciesGallery>;
  try {
    species = readAdminSpeciesGallery(id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link
        href="/admin"
        className="text-[13px] text-muted-foreground hover:text-foreground"
      >
        ← ყველა სახეობა
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
        {species.commonName}
      </h1>
      <p className="mt-2 text-[14px] text-muted-foreground">
        <em>{species.scientificName}</em>
        {species.unpublished ? " · unpublished" : ""}
      </p>
      <div className="mt-10">
        <AdminSpeciesEditor id={id} gallery={species.gallery} />
      </div>
    </main>
  );
}
