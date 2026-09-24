import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { uploadStandalonePhotos } from "@/lib/adminPhotos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLocalAdminEnabled()) return localAdminForbiddenResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form" }, { status: 400 });
  }

  const files = form
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
  if (files.length === 0) {
    return Response.json(
      { error: "Choose at least one photo" },
      { status: 400 },
    );
  }

  try {
    const result = await uploadStandalonePhotos(
      await Promise.all(
        files.map(async (file) => ({
          bytes: Buffer.from(await file.arrayBuffer()),
          filename: file.name,
        })),
      ),
    );
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
