import { SpeciesProfile } from "@/components/SpeciesProfile";
import { getSpeciesById, species } from "@/data/species";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return species.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getSpeciesById(id);

  if (!item) {
    return { title: "სახეობა ვერ მოიძებნა — ReptiVerse" };
  }

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
  const item = getSpeciesById(id);

  if (!item) {
    notFound();
  }

  const related = species.filter((s) => s.id !== item.id).slice(0, 3);

  return <SpeciesProfile species={item} related={related} />;
}
