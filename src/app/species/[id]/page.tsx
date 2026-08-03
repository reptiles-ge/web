import { SpeciesProfile } from "@/components/SpeciesProfile";
import { fetchSpeciesDetail } from "@/lib/species-api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchSpeciesDetail(id);

  if (!data) {
    return { title: "სახეობა ვერ მოიძებნა — ReptiVerse" };
  }

  const { species: item } = data;

  return {
    title: `${item.commonName} — ReptiVerse`,
    description: item.description,
    openGraph: {
      title: `${item.commonName} (${item.scientificName})`,
      description: item.description,
      images: [item.image],
    },
  };
}

export default async function SpeciesPage({ params }: PageProps) {
  const { id } = await params;
  const data = await fetchSpeciesDetail(id);

  if (!data) {
    notFound();
  }

  return (
    <SpeciesProfile species={data.species} related={data.related} />
  );
}
