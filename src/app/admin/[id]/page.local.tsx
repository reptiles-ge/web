import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminSpeciesEditor } from "@/components/admin/AdminSpeciesEditor";
import { assertLocalAdminPage } from "@/lib/adminAccess";
import {
  isSpeciesContentId,
  readAdminSpeciesGallery,
} from "@/lib/adminGalleryMdx";
import { readAdminSpecies } from "@/lib/adminSpeciesApi";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminSpeciesPage({ params }: Props) {
  assertLocalAdminPage();
  const { id } = await params;
  if (!isSpeciesContentId(id)) notFound();

  let loaded: Awaited<ReturnType<typeof readAdminSpecies>>;
  try {
    loaded = await readAdminSpecies(id);
  } catch {
    notFound();
  }
  const { base, status } = loaded.record;
  const species = {
    commonName: base.commonName,
    fieldRecords: readFieldRecords(id),
    gallery: base.gallery,
    image: base.image,
    mobileImage: base.mobileImage ?? "",
    scientificName: base.scientificName,
    unpublished: status !== "published",
  };

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link
        className="text-[13px] text-muted-foreground hover:text-foreground"
        href="/admin"
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
        <AdminSpeciesEditor
          commonName={species.commonName}
          fieldRecords={species.fieldRecords}
          gallery={species.gallery}
          id={id}
          image={species.image}
          key={id}
          mobileImage={species.mobileImage}
          scientificName={species.scientificName}
        />
      </div>
    </main>
  );
}

function readFieldRecords(id: string) {
  try {
    return readAdminSpeciesGallery(id).fieldRecords;
  } catch {
    return [];
  }
}
