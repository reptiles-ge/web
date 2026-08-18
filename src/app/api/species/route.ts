import { getFeaturedSpecies } from "@/data/species";

export async function GET() {
  const list = getFeaturedSpecies().map((item) => ({
    id: item.id,
    commonName: item.commonName,
    scientificName: item.scientificName,
    genus: item.genus,
    location: item.location,
    description: item.description,
    danger: item.danger,
    image: item.image,
  }));

  return Response.json(
    { species: list },
    { headers: { "X-Robots-Tag": "noindex, nofollow" } },
  );
}
