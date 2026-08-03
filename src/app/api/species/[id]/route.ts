import { getFeaturedSpecies, getSpeciesById } from "@/data/species";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const item = getSpeciesById(id);

  if (!item) {
    return Response.json({ error: "Species not found" }, { status: 404 });
  }

  const related = getFeaturedSpecies()
    .filter((entry) => entry.id !== item.id)
    .slice(0, 3);

  return Response.json({
    species: item,
    related,
  });
}
