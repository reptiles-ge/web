import { isLocalAdminEnabled, localAdminForbiddenResponse } from "@/lib/adminAccess";
import { isSpeciesContentId } from "@/lib/adminGalleryMdx";
import { addSpeciesPhotos } from "@/lib/adminPhotos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function textField(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!isLocalAdminEnabled()) return localAdminForbiddenResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form" }, { status: 400 });
  }

  const id = textField(form, "id");
  if (!isSpeciesContentId(id)) {
    return Response.json({ error: "Invalid species id" }, { status: 400 });
  }

  const uploads = form
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (uploads.length === 0) {
    return Response.json({ error: "Choose at least one photo" }, { status: 400 });
  }

  try {
    const result = await addSpeciesPhotos({
      id,
      files: await Promise.all(
        uploads.map(async (file) => ({
          filename: file.name,
          bytes: Buffer.from(await file.arrayBuffer()),
        })),
      ),
      credit: {
        photographer: textField(form, "photographer"),
        photographerEn: textField(form, "photographerEn"),
        location: textField(form, "location"),
        locationEn: textField(form, "locationEn"),
        date: textField(form, "date"),
      },
    });

    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
