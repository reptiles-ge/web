import { getFeaturedSpecies } from "@/data/species";

export async function GET() {
  const list = getFeaturedSpecies().map((item) => ({
    commonName: item.commonName,
    danger: item.danger,
    description: item.description,
    genus: item.genus,
    id: item.id,
    image: item.image,
    location: item.location,
    scientificName: item.scientificName,
  }));

  return Response.json(
    { species: list },
    { headers: { "X-Robots-Tag": "noindex, nofollow" } },
  );
}
