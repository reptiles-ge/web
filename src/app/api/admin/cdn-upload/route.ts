import {
  isLocalAdminEnabled,
  localAdminForbiddenResponse,
} from "@/lib/adminAccess";
import { openStandalonePhotoPullRequest } from "@/lib/adminPhotoPullRequest";
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
          ? {
              pullRequestError: "No optimized photos were added to the catalog",
            }
          : {}),
      });
    }
    try {
      const pullRequestUrl = await openStandalonePhotoPullRequest(catalog);
      return Response.json({ ...result, pullRequestUrl });
    } catch (error) {
      const pullRequestError =
        error instanceof Error ? error.message : "Could not open pull request";
      return Response.json({ ...result, pullRequestError });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
