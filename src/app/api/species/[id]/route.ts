import { getSpeciesById } from "@/data/species";
import { getRelatedSpecies } from "@/lib/speciesRelated";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const item = getSpeciesById(id);

  if (!item) {
    return Response.json(
      { error: "Species not found" },
      { headers: { "X-Robots-Tag": "noindex, nofollow" }, status: 404 },
    );
  }

  const related = getRelatedSpecies(item.id);

  return Response.json(
    {
      related,
      species: item,
    },
    { headers: { "X-Robots-Tag": "noindex, nofollow" } },
  );
}
