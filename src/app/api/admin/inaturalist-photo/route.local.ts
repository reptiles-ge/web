import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import { isLocalAdminOriginRequest } from "@/lib/adminRequest";
import {
  fetchINaturalistPhoto,
  type INaturalistPhotoFailure,
  iNaturalistPhotoFormData,
} from "@/lib/inaturalistPhoto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FAILURES: Record<
  INaturalistPhotoFailure,
  { error: string; status: number }
> = {
  download_failed: {
    error: "iNaturalist-ის ფოტო ვერ ჩამოიტვირთა",
    status: 502,
  },
  invalid_url: {
    error: "iNaturalist-ის დაკვირვების სწორი URL მიუთითე",
    status: 400,
  },
  no_photo: { error: "დაკვირვებას გამოსაყენებელი ფოტო არ აქვს", status: 422 },
  no_photographer: {
    error: "დაკვირვებას ფოტოგრაფის username არ აქვს",
    status: 422,
  },
  not_found: { error: "iNaturalist-ის დაკვირვება ვერ მოიძებნა", status: 404 },
  rate_limited: {
    error: "iNaturalist ახლა მოთხოვნებს ზღუდავს, სცადე ერთ წუთში",
    status: 503,
  },
  too_large: { error: "ფოტო 12 MB-ზე დიდია ან ცარიელია", status: 422 },
  unreachable: {
    error: "iNaturalist-თან დაკავშირება ვერ მოხერხდა",
    status: 502,
  },
  unsupported_format: {
    error: "ფოტოს ფორმატი არ არის მხარდაჭერილი",
    status: 422,
  },
};

export async function POST(request: Request) {
  if (!isLocalAdminOriginRequest(request)) return localAdminForbiddenResponse();

  let url: string;
  try {
    const body = (await request.json()) as { url?: unknown };
    url = typeof body.url === "string" ? body.url : "";
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await fetchINaturalistPhoto(url);
  if (!result.ok) {
    const failure = FAILURES[result.reason];
    return Response.json({ error: failure.error }, { status: failure.status });
  }
  return new Response(iNaturalistPhotoFormData(result), {
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}
