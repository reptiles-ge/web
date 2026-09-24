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
    const { catalog, ...result } = await uploadStandalonePhotos(
      await Promise.all(
        files.map(async (file) => ({
          bytes: Buffer.from(await file.arrayBuffer()),
          filename: file.name,
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
