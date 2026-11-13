import { uploadStandalonePhotos } from "@/lib/adminPhotos";
import { adminErrorResponse, readLocalAdminFormData } from "@/lib/adminRequest";
import { applyOptimizeCatalog } from "@/lib/imageOptimize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { form, response } = await readLocalAdminFormData(request);
  if (response) return response;

  const names = form.getAll("names");
  const uploads = form
    .getAll("photos")
    .map((item, index) => ({
      file: item,
      name: typeof names[index] === "string" ? names[index] : "",
    }))
    .filter(
      (item): item is { file: File; name: string } =>
        item.file instanceof File && item.file.size > 0,
    );
  if (uploads.length === 0) {
    return Response.json(
      { error: "Choose at least one photo" },
      { status: 400 },
    );
  }

  try {
    const { catalog, ...result } = await uploadStandalonePhotos(
      await Promise.all(
        uploads.map(async ({ file, name }) => ({
          bytes: Buffer.from(await file.arrayBuffer()),
          filename: file.name,
          name,
        })),
      ),
    );
    if (catalog.length === 0) {
      return Response.json({
        ...result,
        ...(result.uploaded.length > 0
          ? { catalogError: "No optimized photos were added to the catalog" }
          : {}),
      });
    }
    try {
      await applyOptimizeCatalog(catalog);
      return Response.json({ ...result, cataloged: catalog.length });
    } catch (error) {
      const catalogError =
        error instanceof Error ? error.message : "Could not update the catalog";
      return Response.json({ ...result, catalogError });
    }
  } catch (error) {
    return adminErrorResponse(error, "Upload failed");
  }
}
